// /app/api/products/[id]/route.js
// Next.js 13+ App Router - GET, DELETE por ID

// IMPORTANTE: Esta debe ser la misma referencia de productos que en route.js principal
// En una app real, usarías una base de datos compartida
let products = [
  { id: 1, name: "Laptop", price: 1200 },
  { id: 2, name: "Mouse", price: 25 },
  { id: 3, name: "Teclado", price: 50 },
];

// Maneja solicitudes GET - Obtener producto por ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const productId = parseInt(id);
    
    // Validar que el ID sea un número válido
    if (isNaN(productId)) {
      return Response.json(
        { 
          error: "ID inválido",
          message: "El ID debe ser un número válido"
        }, 
        { status: 400 }
      );
    }
    
    // Buscar el producto
    const product = products.find((p) => p.id === productId);
    
    if (!product) {
      return Response.json(
        { 
          error: "Producto no encontrado",
          message: `No existe un producto con ID: ${id}`
        }, 
        { status: 404 }
      );
    }
    
    return Response.json(product, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
  } catch (error) {
    return Response.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}

// Maneja solicitudes DELETE - Eliminar producto por ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const productId = parseInt(id);
    
    // Validar que el ID sea un número válido
    if (isNaN(productId)) {
      return Response.json(
        { 
          error: "ID inválido",
          message: "El ID debe ser un número válido"
        }, 
        { status: 400 }
      );
    }
    
    // Buscar el índice del producto
    const productIndex = products.findIndex((p) => p.id === productId);
    
    // Si no se encuentra el producto
    if (productIndex === -1) {
      return Response.json(
        { 
          error: "Producto no encontrado",
          message: `No se puede eliminar. No existe un producto con ID: ${id}`
        }, 
        { status: 404 }
      );
    }
    
    // Guardar datos del producto antes de eliminarlo (para el log)
    const deletedProduct = products[productIndex];
    
    // Eliminar el producto del array
    products.splice(productIndex, 1);
    
    // Respuesta exitosa con información del producto eliminado
    return Response.json(
      { 
        message: "Producto eliminado exitosamente",
        deletedProduct: {
          id: deletedProduct.id,
          name: deletedProduct.name,
          price: deletedProduct.price
        },
        remainingProducts: products.length
      }, 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
  } catch (error) {
    return Response.json(
      { 
        error: 'Error interno del servidor',
        message: 'No se pudo eliminar el producto'
      }, 
      { status: 500 }
    );
  }
}

// Maneja otros métodos HTTP no permitidos
export async function POST(request, { params }) {
  return Response.json(
    { 
      error: "Método no permitido",
      message: "Este endpoint acepta GET y DELETE únicamente",
      allowedMethods: ["GET", "DELETE"]
    }, 
    { 
      status: 405,
      headers: {
        'Allow': 'GET, DELETE'
      }
    }
  );
}

export async function PUT(request, { params }) {
  return Response.json(
    { 
      error: "Método no permitido",
      message: "Este endpoint acepta GET y DELETE únicamente",
      allowedMethods: ["GET", "DELETE"]
    }, 
    { 
      status: 405,
      headers: {
        'Allow': 'GET, DELETE'
      }
    }
  );
}