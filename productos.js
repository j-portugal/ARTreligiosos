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
    }
];

// Comprobación para ver si el archivo cargó correctamente
console.log("¡El catálogo de productos se ha cargado correctamente!");
console.log("Total de productos:", productos.length);