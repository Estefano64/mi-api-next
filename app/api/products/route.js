// /app/api/products/route.js
// API Products con Filtros - Next.js 13+ App Router

let products = [
  { id: 1, name: "Laptop", price: 1200 },
  { id: 2, name: "Mouse", price: 25 },
  { id: 3, name: "Teclado", price: 50 },
  { id: 4, name: "Monitor", price: 300 },
  { id: 5, name: "Webcam", price: 80 },
  { id: 6, name: "Auriculares", price: 150 },
  { id: 7, name: "Teclado Gaming", price: 120 },
  { id: 8, name: "Mouse Gaming", price: 60 }
];

// GET - Listar productos con filtros
export async function GET(request) {
  try {
    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url);
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const name = searchParams.get('name');
    const sortBy = searchParams.get('sortBy'); // precio, nombre
    const order = searchParams.get('order'); // asc, desc
    
    let filteredProducts = [...products];
    
    // Filtro por precio mínimo
    if (minPrice !== null) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        filteredProducts = filteredProducts.filter(product => product.price >= min);
      }
    }
    
    // Filtro por precio máximo
    if (maxPrice !== null) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        filteredProducts = filteredProducts.filter(product => product.price <= max);
      }
    }
    
    // Filtro por nombre (búsqueda parcial, insensible a mayúsculas)
    if (name) {
      const searchName = name.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchName)
      );
    }
    
    // Ordenamiento
    if (sortBy) {
      filteredProducts.sort((a, b) => {
        let comparison = 0;
        
        if (sortBy === 'price') {
          comparison = a.price - b.price;
        } else if (sortBy === 'name') {
          comparison = a.name.localeCompare(b.name);
        } else if (sortBy === 'id') {
          comparison = a.id - b.id;
        }
        
        // Orden descendente si se especifica
        if (order === 'desc') {
          comparison = -comparison;
        }
        
        return comparison;
      });
    }
    
    // Metadatos de la consulta
    const metadata = {
      total: products.length,
      filtered: filteredProducts.length,
      filters: {
        minPrice: minPrice ? parseFloat(minPrice) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        name: name || null,
        sortBy: sortBy || null,
        order: order || 'asc'
      }
    };
    
    return Response.json({
      products: filteredProducts,
      metadata
    }, { 
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

// POST - Crear nuevo producto
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, price } = body;
    
    // Validaciones
    if (!name || price === undefined) {
      return Response.json(
        { 
          error: "Datos faltantes",
          message: "Nombre y precio son requeridos",
          required: ["name", "price"]
        }, 
        { status: 400 }
      );
    }
    
    if (typeof name !== 'string' || typeof price !== 'number') {
      return Response.json(
        { 
          error: "Tipos de datos incorrectos",
          message: "El nombre debe ser texto y el precio debe ser número"
        }, 
        { status: 400 }
      );
    }
    
    if (price <= 0) {
      return Response.json(
        { 
          error: "Precio inválido",
          message: "El precio debe ser un número positivo"
        }, 
        { status: 400 }
      );
    }
    
    // Verificar nombre único
    if (products.some(product => product.name.toLowerCase() === name.toLowerCase().trim())) {
      return Response.json(
        { 
          error: "Producto duplicado",
          message: "Ya existe un producto con este nombre"
        }, 
        { status: 409 }
      );
    }
    
    const newId = Math.max(...products.map(p => p.id)) + 1;
    const newProduct = { 
      id: newId, 
      name: name.trim(), 
      price: parseFloat(price) 
    };
    
    products.push(newProduct);
    
    return Response.json(newProduct, { 
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Location': `/api/products/${newId}`
      }
    });
    
  } catch (error) {
    return Response.json(
      { 
        error: 'Error en la solicitud',
        message: 'Formato JSON inválido o error interno'
      }, 
      { status: 400 }
    );
  }
}