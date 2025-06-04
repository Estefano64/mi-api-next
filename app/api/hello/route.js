// Para Next.js 13+ con App Router
// Crear: /app/api/hello/route.js

export async function GET(request) {
  return Response.json({ 
    message: "¡Hola desde Next.js API!",
    method: "GET",
    timestamp: new Date().toISOString()
  });
}

export async function POST(request) {
  return Response.json({ 
    message: "POST request recibido",
    method: "POST"
  });
}