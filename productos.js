import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AiZaSyBXUg1aGOJniQEd5LGVbIEgzpjOqJ3QKeY",
    authDomain: "artreligioso.firebaseapp.com",
    projectId: "artreligioso",
    storageBucket: "artreligioso.firebasestorage.app",
    messagingSenderId: "952480192159",
    appId: "1:952480192159:web:3ed2caef40dedab5dc34aa",
    measurementId: "G-YWKKNB1PKG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let productos = [];

const contenedorProductos = document.getElementById("grid-productos");
const buscador = document.getElementById("buscador");

let carrito = JSON.parse(localStorage.getItem("carritoART")) || [];
carrito = carrito.map(item => ({ ...item, id: String(item.id) }));

const btnAbrirCarrito = document.getElementById("btn-abrir-carrito");
const carritoOverlay = document.getElementById("carrito-overlay");
const carritoPanel = document.getElementById("carrito-panel");
const btnCerrarCarrito = document.getElementById("btn-cerrar-carrito");
const btnFinalizarCompra = document.querySelector(".btn-finalizar") || document.getElementById("btn-finalizar");
const contadorCarrito = document.getElementById("contador-carrito");
const carritoBody = document.getElementById("carrito-body");
const carritoPrecioTotal = document.getElementById("carrito-precio-total");

const formateadorCLP = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP"
});

function abrirCarrito(e) {
    if (e) e.preventDefault();
    if (carritoPanel) carritoPanel.classList.add("abierto");
    if (carritoOverlay) carritoOverlay.classList.add("activo");
    if (carritoPanel) carritoPanel.setAttribute("aria-hidden", "false");
}

function cerrarCarrito() {
    if (carritoPanel) carritoPanel.classList.remove("abierto");
    if (carritoOverlay) carritoOverlay.classList.remove("activo");
    if (carritoPanel) carritoPanel.setAttribute("aria-hidden", "true");
}

if (btnAbrirCarrito) btnAbrirCarrito.addEventListener("click", abrirCarrito);
if (btnCerrarCarrito) btnCerrarCarrito.addEventListener("click", cerrarCarrito);
if (carritoOverlay) carritoOverlay.addEventListener("click", cerrarCarrito);
if (btnFinalizarCompra) {
    btnFinalizarCompra.addEventListener("click", () => {
        window.location.href = "checkout.html";
    });
}

function renderizarTarjetas(listaDeProductos) {
    if (!contenedorProductos) return;

    contenedorProductos.innerHTML = "";

    if (!listaDeProductos.length) {
        contenedorProductos.innerHTML = `
            <p style="grid-column: 1/-1; text-align:center; color:gray;">
                No hay productos disponibles.
            </p>
        `;
        return;
    }

    listaDeProductos.forEach((producto) => {
        const precioFormateado = formateadorCLP.format(Number(producto.precio) || 0);

        const tagsHTML = Array.isArray(producto.material)
            ? producto.material.map(tag => `<span class="tag">${tag}</span>`).join("")
            : `<span class="tag">General</span>`;

        const tarjetaHTML = `
            <div class="product-card">
                <div class="product-image-container">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${producto.nombre}</h3>
                    <p class="product-description">${producto.descripcion}</p>
                    <div class="product-tags">${tagsHTML}</div>
                    <div class="product-footer">
                        <span class="product-price">${precioFormateado}</span>
                        <button class="btn-agregar" data-id="${producto.id}">Añadir al carrito</button>
                    </div>
                </div>
            </div>
        `;

        contenedorProductos.innerHTML += tarjetaHTML;
    });
}

async function cargarProductosDesdeFirebase() {
    try {
        if (contenedorProductos) {
            contenedorProductos.innerHTML = `
                <p style="grid-column: 1/-1; text-align:center; color:gray;">
                    Cargando catálogo desde Firebase...
                </p>
            `;
        }

        const querySnapshot = await getDocs(collection(db, "productos"));

        productos = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();

            productos.push({
                id: String(doc.id),
                nombre: data.nombre || "Producto sin nombre",
                descripcion: data.descripcion || "",
                precio: Number(data.precio) || 0,
                cantidad: Number(data.cantidad) || 0,
                imagen: data.imagen || "https://via.placeholder.com/300x200?text=Sin+Imagen",
                material: Array.isArray(data.material) ? data.material : ["General"]
            });
        });

        renderizarTarjetas(productos);
        actualizarCarrito();
    } catch (error) {
        console.error("Error al cargar productos desde Firebase:", error);

        if (contenedorProductos) {
            contenedorProductos.innerHTML = `
                <p style="grid-column: 1/-1; text-align:center; color:red;">
                    Error al conectar con Firebase.
                </p>
            `;
        }
    }
}

if (contenedorProductos) {
    contenedorProductos.addEventListener("click", (event) => {
        const btn = event.target.closest(".btn-agregar");
        if (!btn) return;

        const id = String(btn.getAttribute("data-id"));
        const producto = productos.find(p => String(p.id) === id);
        if (!producto) return;

        const existente = carrito.find(item => String(item.id) === id);

        if (existente) {
            existente.cantidad = (existente.cantidad || 0) + 1;
        } else {
            carrito.push({
                id: String(producto.id),
                nombre: producto.nombre,
                precio: Number(producto.precio) || 0,
                cantidad: 1
            });
        }

        actualizarCarrito();
        abrirCarrito();
    });
}

function actualizarCarrito() {
    const totalUnidades = carrito.reduce((sum, item) => sum + (Number(item.cantidad) || 0), 0);
    const totalPrecio = carrito.reduce(
        (sum, item) => sum + (Number(item.precio) || 0) * (Number(item.cantidad) || 0),
        0
    );

    if (contadorCarrito) contadorCarrito.textContent = totalUnidades;

    if (carritoBody) {
        if (carrito.length === 0) {
            carritoBody.innerHTML = "<p>Tu carrito está vacío</p>";
        } else {
            carritoBody.innerHTML = carrito.map(item => {
                const subtotal = (Number(item.precio) || 0) * (Number(item.cantidad) || 0);

                return `
                    <div class="carrito-item" data-id="${item.id}" style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;">
                        <div>
                            <div style="font-weight:600;color:var(--text-color);">${item.nombre}</div>
                            <div style="font-size:13px;color:var(--text-muted);">Cantidad: ${item.cantidad}</div>
                        </div>
                        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
                            <div style="font-weight:700;color:var(--primary-color);">${formateadorCLP.format(subtotal)}</div>
                            <button class="btn-eliminar" data-id="${item.id}" style="background:none;border:none;color:#c53030;font-size:12px;cursor:pointer;padding:4px 6px;">Quitar</button>
                        </div>
                    </div>
                `;
            }).join("");
        }
    }

    if (carritoPrecioTotal) carritoPrecioTotal.textContent = formateadorCLP.format(totalPrecio);

    localStorage.setItem("carritoART", JSON.stringify(carrito));
}

if (carritoBody) {
    carritoBody.addEventListener("click", (event) => {
        const btn = event.target.closest(".btn-eliminar");
        if (!btn) return;

        const id = String(btn.getAttribute("data-id"));
        carrito = carrito.filter(item => String(item.id) !== id);
        actualizarCarrito();
    });
}

if (buscador) {
    buscador.addEventListener("input", (event) => {
        const textoBusqueda = event.target.value.trim().toLowerCase();

        const productosFiltrados = productos.filter((producto) => {
            const nombre = (producto.nombre || "").toLowerCase();
            const descripcion = (producto.descripcion || "").toLowerCase();
            const material = Array.isArray(producto.material)
                ? producto.material.some((m) => m.toLowerCase().includes(textoBusqueda))
                : false;

            return nombre.includes(textoBusqueda) ||
                   descripcion.includes(textoBusqueda) ||
                   material;
        });

        renderizarTarjetas(productosFiltrados);
    });
}

cargarProductosDesdeFirebase();