// /app/api/users/route.js
// CRUD Completo para Usuarios - Next.js 13+ App Router

let users = [
  { id: 1, name: "Juan Pérez", email: "juan@example.com", age: 25 },
  { id: 2, name: "María González", email: "maria@example.com", age: 30 },
  { id: 3, name: "Carlos López", email: "carlos@example.com", age: 22 },
];

// GET - Listar todos los usuarios
export async function GET(request) {
  try {
    return Response.json(users, { 
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

// POST - Crear nuevo usuario
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, age } = body;
    
    // Validaciones
    if (!name || !email || !age) {
      return Response.json(
        { 
          error: "Datos faltantes",
          message: "Nombre, email y edad son requeridos",
          required: ["name", "email", "age"]
        }, 
        { status: 400 }
      );
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { 
          error: "Email inválido",
          message: "El formato del email no es válido"
        }, 
        { status: 400 }
      );
    }
    
    // Validar edad
    if (typeof age !== 'number' || age < 0 || age > 120) {
      return Response.json(
        { 
          error: "Edad inválida",
          message: "La edad debe ser un número entre 0 y 120"
        }, 
        { status: 400 }
      );
    }
    
    // Verificar email único
    if (users.some(user => user.email === email)) {
      return Response.json(
        { 
          error: "Email duplicado",
          message: "Ya existe un usuario con este email"
        }, 
        { status: 409 }
      );
    }
    
    // Crear nuevo usuario
    const newId = Math.max(...users.map(u => u.id)) + 1;
    const newUser = { 
      id: newId, 
      name: name.trim(), 
      email: email.trim().toLowerCase(), 
      age: parseInt(age) 
    };
    
    users.push(newUser);
    
    return Response.json(newUser, { 
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Location': `/api/users/${newId}`
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

// PUT - Actualizar usuario (actualización parcial)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateFields } = body;
    
    if (!id) {
      return Response.json(
        { 
          error: "ID requerido",
          message: "El ID del usuario es requerido para actualizar"
        }, 
        { status: 400 }
      );
    }
    
    const userIndex = users.findIndex(u => u.id === parseInt(id));
    
    if (userIndex === -1) {
      return Response.json(
        { 
          error: "Usuario no encontrado",
          message: `No existe un usuario con ID: ${id}`
        }, 
        { status: 404 }
      );
    }
    
    // Validar campos permitidos
    const allowedFields = ['name', 'email', 'age'];
    const invalidFields = Object.keys(updateFields).filter(
      field => !allowedFields.includes(field)
    );
    
    if (invalidFields.length > 0) {
      return Response.json(
        { 
          error: "Campos inválidos",
          message: `Campos no permitidos: ${invalidFields.join(', ')}`,
          allowedFields
        }, 
        { status: 400 }
      );
    }
    
    // Validaciones específicas de campos
    if (updateFields.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateFields.email)) {
        return Response.json(
          { 
            error: "Email inválido",
            message: "El formato del email no es válido"
          }, 
          { status: 400 }
        );
      }
      
      // Verificar email único (excluyendo el usuario actual)
      if (users.some(user => user.email === updateFields.email && user.id !== parseInt(id))) {
        return Response.json(
          { 
            error: "Email duplicado",
            message: "Ya existe otro usuario con este email"
          }, 
          { status: 409 }
        );
      }
      
      updateFields.email = updateFields.email.trim().toLowerCase();
    }
    
    if (updateFields.age !== undefined) {
      if (typeof updateFields.age !== 'number' || updateFields.age < 0 || updateFields.age > 120) {
        return Response.json(
          { 
            error: "Edad inválida",
            message: "La edad debe ser un número entre 0 y 120"
          }, 
          { status: 400 }
        );
      }
    }
    
    if (updateFields.name !== undefined) {
      updateFields.name = updateFields.name.trim();
      if (updateFields.name.length === 0) {
        return Response.json(
          { 
            error: "Nombre inválido",
            message: "El nombre no puede estar vacío"
          }, 
          { status: 400 }
        );
      }
    }
    
    // Actualizar solo los campos proporcionados (actualización parcial)
    users[userIndex] = { ...users[userIndex], ...updateFields };
    
    return Response.json(users[userIndex], { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
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

// DELETE - Eliminar usuario
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return Response.json(
        { 
          error: "ID requerido",
          message: "El ID del usuario es requerido para eliminar"
        }, 
        { status: 400 }
      );
    }
    
    const userIndex = users.findIndex(u => u.id === parseInt(id));
    
    if (userIndex === -1) {
      return Response.json(
        { 
          error: "Usuario no encontrado",
          message: `No se puede eliminar. No existe un usuario con ID: ${id}`
        }, 
        { status: 404 }
      );
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    
    return Response.json(
      { 
        message: "Usuario eliminado exitosamente",
        deletedUser: {
          id: deletedUser.id,
          name: deletedUser.name,
          email: deletedUser.email,
          age: deletedUser.age
        },
        remainingUsers: users.length
      }, 
      { status: 200 }
    );
    
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