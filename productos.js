// Array principal que contiene todos nuestros productos
// Piensa en esto como una mini base de datos local
const productos = [
    {
        id: 1, // El identificador único (índice)
        nombre: "Escultura de San Francisco de Asís",
        material: ["Madera", "Artesanal", "Clásico"], // Usamos un array para los tags/materiales
        descripcion: "Fina pieza artesanal tallada con exquisito detalle en madera seleccionada, ideal para interiores y altares personales.",
        precio: 45000, // Precio en números enteros para facilitar cálculos matemáticos
        cantidad: 5, // Stock disponible
        imagen: "https://via.placeholder.com/300x200?text=Escultura" // URL de imagen temporal
    },
    {
        id: 2,
        nombre: "Cruz Relicario de Plata",
        material: ["Plata", "Relicario", "Joyas"],
        descripcion: "Cruz finamente trabajada en plata de ley 925 con detalles ornamentales de estilo bizantino y engastes hechos a mano.",
        precio: 85000,
        cantidad: 2,
        imagen: "https://via.placeholder.com/300x200?text=Cruz+Plata"
    },
    {
        id: 3,
        nombre: "Rosario de Olivo de Jerusalén",
        material: ["Olivo", "Rosario", "Jerusalén"],
        descripcion: "Rosario tradicional confeccionado con cuentas de madera de olivo natural importadas y engarzadas con cordón ultra resistente.",
        precio: 15000,
        cantidad: 20,
        imagen: "https://via.placeholder.com/300x200?text=Rosario"
    },
    {
        // Producto nuevo de ejemplo
        id: 4,
        nombre: "Cáliz Dorado Litúrgico",
        material: ["Bronce", "Dorado", "Liturgia"],
        descripcion: "Cáliz de bronce con baño dorado, diseño clásico para ceremonias litúrgicas.",
        precio: 120000,
        cantidad: 1,
        imagen: "https://via.placeholder.com/300x200?text=Caliz"
    },
    {
        // Producto nuevo de ejemplo
        id: 5,
        nombre: "Icono Bizantino de la Virgen",
        material: ["Madera", "Pintura al óleo", "Religioso"],
        descripcion: "Icono pintado a mano siguiendo la tradición bizantina, ideal para devoción personal.",
        precio: 95000,
        cantidad: 3,
        imagen: "https://via.placeholder.com/300x200?text=Icono"
    }
];

// 1. Obtener el contenedor HTML donde irán las tarjetas
const contenedorProductos = document.getElementById("grid-productos");

// 2. Función para renderizar (dibujar) las tarjetas
function renderizarTarjetas(listaDeProductos) {
    // Primero, limpiamos el contenedor para evitar duplicados si llamamos la función varias veces
    contenedorProductos.innerHTML = "";

    // 3. Recorremos el array de productos uno por uno
    listaDeProductos.forEach((producto) => {
        // Formatear el precio a moneda local (CLP)
        const precioFormateado = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(producto.precio);

        // Crear los "tags" de material a partir del array del producto
        const tagsHTML = producto.material.map(tag => `<span class="tag">${tag}</span>`).join('');

        // 4. Crear la estructura HTML (el "molde") de la tarjeta usando los datos del objeto
        const tarjetaHTML = `
            <div class="product-card">
                <div class="product-image-container">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${producto.nombre}</h3>
                    <p class="product-description">${producto.descripcion}</p>
                    <div class="product-tags">
                        ${tagsHTML}
                    </div>
                    <div class="product-footer">
                        <span class="product-price">${precioFormateado}</span>
                        <button class="btn-agregar" data-id="${producto.id}">Añadir al carrito</button>
                    </div>
                </div>
            </div>
        `;

        // 5. Inyectar la tarjeta recién creada dentro del contenedor principal
        contenedorProductos.innerHTML += tarjetaHTML;
    });
}

// 6. Ejecutar la función inmediatamente al cargar la página usando nuestro array principal
renderizarTarjetas(productos);

// Comprobación para ver si el archivo cargó correctamente
console.log("¡Las tarjetas se han generado dinámicamente!");