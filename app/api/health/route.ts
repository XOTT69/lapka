export async function GET() {
  return Response.json({
    ok: true,
    service: 'lapka',
    version: '0.1.0'
  });
}
