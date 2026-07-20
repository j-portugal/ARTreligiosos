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
const buscador = document.getElementById("buscador");

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

if (buscador) {
    buscador.addEventListener("input", (event) => {
        const textoBusqueda = event.target.value.trim().toLowerCase();

        const productosFiltrados = productos.filter((producto) => {
            const coincideNombre = producto.nombre.toLowerCase().includes(textoBusqueda);
            const coincideMaterial = producto.material.some((material) =>
                material.toLowerCase().includes(textoBusqueda)
            );

            return coincideNombre || coincideMaterial;
        });

        renderizarTarjetas(productosFiltrados);
    });
}

// Comprobación para ver si el archivo cargó correctamente
console.log("¡Las tarjetas se han generado dinámicamente!");

// -------------------------
// Lógica del carrito
// -------------------------

let carrito = JSON.parse(localStorage.getItem('carritoART')) || [];

const btnAbrirCarrito = document.getElementById('btn-abrir-carrito');
const carritoOverlay = document.getElementById('carrito-overlay');
const carritoPanel = document.getElementById('carrito-panel');
const btnCerrarCarrito = document.getElementById('btn-cerrar-carrito');
const contadorCarrito = document.getElementById('contador-carrito');
const carritoBody = document.getElementById('carrito-body');
const carritoPrecioTotal = document.getElementById('carrito-precio-total');

const formateadorCLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

function abrirCarrito(e) {
    if (e) e.preventDefault();
    if (carritoPanel) carritoPanel.classList.add('abierto');
    if (carritoOverlay) carritoOverlay.classList.add('activo');
    if (carritoPanel) carritoPanel.setAttribute('aria-hidden', 'false');
}

function cerrarCarrito() {
    if (carritoPanel) carritoPanel.classList.remove('abierto');
    if (carritoOverlay) carritoOverlay.classList.remove('activo');
    if (carritoPanel) carritoPanel.setAttribute('aria-hidden', 'true');
}

if (btnAbrirCarrito) btnAbrirCarrito.addEventListener('click', abrirCarrito);
if (btnCerrarCarrito) btnCerrarCarrito.addEventListener('click', cerrarCarrito);
if (carritoOverlay) carritoOverlay.addEventListener('click', cerrarCarrito);

// Delegación: escuchar clicks en los botones "Añadir al carrito"
if (contenedorProductos) {
    contenedorProductos.addEventListener('click', (event) => {
        const btn = event.target.closest('.btn-agregar');
        if (!btn) return;

        const id = Number(btn.getAttribute('data-id'));
        const producto = productos.find(p => p.id === id);
        if (!producto) return;

        const existente = carrito.find(item => item.id === id);
        if (existente) {
            existente.cantidad = (existente.cantidad || 0) + 1;
        } else {
            carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
        }

        actualizarCarrito();
        abrirCarrito();
    });
}

function actualizarCarrito() {
    const totalUnidades = carrito.reduce((sum, it) => sum + (it.cantidad || 0), 0);
    const totalPrecio = carrito.reduce((sum, it) => sum + (it.precio * (it.cantidad || 0)), 0);

    if (contadorCarrito) contadorCarrito.textContent = totalUnidades;

    if (!carritoBody) return;

    if (carrito.length === 0) {
        carritoBody.innerHTML = 'Tu carrito está vacío';
    } else {
        const itemsHTML = carrito.map(item => {
            const subtotal = item.precio * item.cantidad;
            return `
                <div class="carrito-item" data-id="${item.id}" style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;">
                    <div>
                        <div style="font-weight:600;color:var(--text-color);">${item.nombre}</div>
                        <div style="font-size:13px;color:var(--text-muted);">Cantidad: ${item.cantidad}</div>
                    </div>
                    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
                        <div style="font-weight:700;color:var(--primary-color);">${formateadorCLP.format(subtotal)}</div>
                        <button class='btn-eliminar' data-id='${item.id}' style='background:none;border:none;color:#c53030;font-size:12px;cursor:pointer;padding:4px 6px;'>Quitar</button>
                    </div>
                </div>
            `;
        }).join('');

        carritoBody.innerHTML = itemsHTML;
    }

    if (carritoPrecioTotal) carritoPrecioTotal.textContent = formateadorCLP.format(totalPrecio);

    localStorage.setItem('carritoART', JSON.stringify(carrito));
}

// Delegación en el cuerpo del carrito para manejar "Quitar"
if (carritoBody) {
    carritoBody.addEventListener('click', (event) => {
        const btn = event.target.closest('.btn-eliminar');
        if (!btn) return;

        const id = Number(btn.getAttribute('data-id'));
        carrito = carrito.filter(item => item.id !== id);
        actualizarCarrito();
    });
}

// Dibujar el carrito recuperado al cargar la página, cuando ya existen los nodos del DOM
actualizarCarrito();