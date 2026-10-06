import fs from 'node:fs';
import path from 'node:path';
import ExcelJS from 'exceljs';

const [, , inputArg, supplierArg = 'supplier', outputArg] = process.argv;
if (!inputArg) {
  console.error('Usage: npm run import:supplier -- <feed.xlsx|feed.csv> [supplier_id] [output.json]');
  process.exit(1);
}

const input = path.resolve(inputArg);
const supplierId = String(supplierArg).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
const output = path.resolve(outputArg || `data/imports/${supplierId}.json`);

const aliases = {
  supplier_sku:['supplier_sku','sku','артикул','код','код товару','id'],
  ean:['ean','barcode','штрихкод','штрих-код','ean13','gtin'],
  title:['title','name','назва','найменування','товар'],
  brand:['brand','бренд','виробник'],
  category:['category','категорія','група'],
  country:['country','країна','країна виробництва','country of origin'],
  weight_or_volume:['weight_or_volume','weight','volume','вага','об’єм','обєм','фасовка'],
  purchase_price_uah:['purchase_price_uah','purchase_price','cost','price','ціна','оптова ціна','закупівельна ціна'],
  rrp_uah:['rrp_uah','rrp','recommended price','ррц','рекомендована ціна'],
  stock:['stock','qty','quantity','залишок','кількість','наявність'],
  carton_qty:['carton_qty','box_qty','case_qty','в ящику','ящик','коробка','кратність'],
  minimum_order_qty:['minimum_order_qty','moq','мінімальне замовлення','мін. кількість'],
  best_before:['best_before','expiry','expiration','термін придатності','строк придатності'],
  image_urls:['image_urls','images','image','photo','фото','зображення'],
  ingredients:['ingredients','склад','состав'],
  allergens:['allergens','алергени','аллергены'],
  importer_label:['importer_label','importer','імпортер','маркування','етикетка']
};

const cleanHeader = v => String(v ?? '').trim().toLowerCase().replace(/\s+/g,' ');
const reverse = new Map();
for (const [canonical, names] of Object.entries(aliases)) {
  for (const name of names) reverse.set(cleanHeader(name), canonical);
}

const num = value => {
  if (value == null || value === '') return null;
  const n = Number(String(value).replace(/\s/g,'').replace(',','.').replace(/[^0-9.-]/g,''));
  return Number.isFinite(n) ? n : null;
};

const splitImages = value => String(value || '').split(/[|;,\n]+/).map(v=>v.trim()).filter(v=>/^https?:\/\//i.test(v));

function normalizeRow(raw) {
  const mapped = {};
  for (const [key,value] of Object.entries(raw)) {
    const canonical = reverse.get(cleanHeader(key));
    if (canonical) mapped[canonical] = value;
  }
  const title = String(mapped.title || '').trim();
  if (!title) return null;

  return {
    supplier_id:supplierId,
    supplier_sku:String(mapped.supplier_sku || '').trim(),
    ean:String(mapped.ean || '').replace(/\D/g,''),
    title,
    brand:String(mapped.brand || '').trim(),
    category:String(mapped.category || '').trim(),
    country:String(mapped.country || '').trim(),
    weight_or_volume:String(mapped.weight_or_volume || '').trim(),
    purchase_price_uah:num(mapped.purchase_price_uah),
    rrp_uah:num(mapped.rrp_uah),
    stock:num(mapped.stock),
    carton_qty:num(mapped.carton_qty),
    minimum_order_qty:num(mapped.minimum_order_qty),
    best_before:String(mapped.best_before || '').trim(),
    image_urls:splitImages(mapped.image_urls),
    ingredients:String(mapped.ingredients || '').trim(),
    allergens:String(mapped.allergens || '').trim(),
    importer_label:String(mapped.importer_label || '').trim(),
    updated_at:new Date().toISOString()
  };
}

async function readXlsx(file) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(file);
  const ws = wb.worksheets[0];
  if (!ws) return [];
  const headers = [];
  ws.getRow(1).eachCell((cell,col)=>headers[col]=String(cell.text||cell.value||'').trim());
  const rows=[];
  ws.eachRow((row,index)=>{
    if(index===1)return;
    const obj={};
    headers.forEach((h,col)=>{ if(h)obj[h]=row.getCell(col).text || row.getCell(col).value || ''; });
    rows.push(obj);
  });
  return rows;
}

async function readCsv(file) {
  const text=fs.readFileSync(file,'utf8').replace(/^\uFEFF/,'');
  const first=text.split(/\r?\n/,1)[0]||'';
  const delimiter=(first.match(/;/g)||[]).length>(first.match(/,/g)||[]).length?';':',';
  const parseLine=line=>{
    const out=[]; let cur='', quoted=false;
    for(let i=0;i<line.length;i++){
      const ch=line[i];
      if(ch==='"'){
        if(quoted&&line[i+1]==='"'){cur+='"';i++;} else quoted=!quoted;
      } else if(ch===delimiter&&!quoted){out.push(cur);cur='';}
      else cur+=ch;
    }
    out.push(cur); return out;
  };
  const lines=text.split(/\r?\n/).filter(l=>l.trim());
  const headers=parseLine(lines.shift()||'').map(h=>h.trim());
  return lines.map(line=>{
    const vals=parseLine(line),obj={};
    headers.forEach((h,i)=>obj[h]=vals[i]??'');
    return obj;
  });
}

const ext=path.extname(input).toLowerCase();
const rawRows=ext==='.xlsx'||ext==='.xlsm'?await readXlsx(input):await readCsv(input);
const items=rawRows.map(normalizeRow).filter(Boolean);

const report={
  supplier_id:supplierId,
  source_file:path.basename(input),
  imported_at:new Date().toISOString(),
  total_rows:rawRows.length,
  normalized_rows:items.length,
  ready_for_sale:items.filter(x=>x.purchase_price_uah>0&&x.stock>0&&x.title).length,
  missing_price:items.filter(x=>!(x.purchase_price_uah>0)).length,
  missing_stock:items.filter(x=>!(x.stock>0)).length,
  items
};

fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(`Imported ${report.normalized_rows}/${report.total_rows} rows -> ${output}`);
console.log(`Ready for sale: ${report.ready_for_sale}; missing price: ${report.missing_price}; missing stock: ${report.missing_stock}`);
