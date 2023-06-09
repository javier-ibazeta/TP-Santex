// Cada producto que vende el super es creado con esta clase
class Producto {
    sku;            // Identificador único del producto
    nombre;         // Su nombre
    precio;         // Su precio
    categoria;      // Categoría a la que pertenece este producto
    stock;          // Cantidad disponible en stock

    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;

        // Si no me definen stock, pongo 10 por defecto
        
        if (stock) {
            this.stock = stock;
        } else {
            this.stock = 10;
        }
    }
}

// Creo todos los productos que vende mi super
const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];

// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
    productos;      // Lista de productos agregados
    categorias;     // Lista de las diferentes categorías de los productos en el carrito
    precioTotal;    // Lo que voy a pagar al finalizar mi compra

    // Al crear un carrito, empieza vacío
    constructor() {
        this.productos = [];
        this.categorias = [];
        this.precioTotal = 0;
    }

    /**
     * función que agrega @{cantidad} de productos con @{sku} al carrito
     */
    async agregarProducto(sku, cantidad) {
        console.log(`Agregando ${sku} ${cantidad}`);

        // Busco el producto en la "base de datos"
        try {
            const producto = await findProductBySku(sku);
            console.log("Producto encontrado", producto);

            // Verifico si el producto ya está en el carrito
            const productoEnCarrito = this.productos.find(prod => prod.sku === sku);
            if (productoEnCarrito) {
                // El producto ya está en el carrito, actualizo la cantidad
                productoEnCarrito.cantidad += cantidad;
            } else {
                // El producto no está en el carrito, lo agrego
                const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad);
                this.productos.push(nuevoProducto);
                this.categorias.push(producto.categoria);
            }

            // Actualizo el precio total
            this.precioTotal += producto.precio * cantidad;
        } catch (error) {
            console.error("EL PRODUCTO NO EXISTE");
        }
    }

    /**
     * función que elimina @{cantidad} de productos con @{sku} del carrito
     */
    eliminarProducto(sku, cantidad) {
        return new Promise((resolve, reject) => {
            console.log(`Eliminando ${sku} ${cantidad}`);

            // Busco el producto en el carrito
            const productoEnCarrito = this.productos.find(prod => prod.sku === sku);
            if (!productoEnCarrito) {
                reject(`Producto ${sku} no encontrado en el carrito`);
                return;
            }

            // Verifico si la cantidad a eliminar es menor a la cantidad en el carrito
            if (cantidad < productoEnCarrito.cantidad) {
                productoEnCarrito.cantidad -= cantidad;
            } else {
                // Elimino el producto del carrito
                const index = this.productos.indexOf(productoEnCarrito);
                this.productos.splice(index, 1);
                // Elimino la categoría si ya no hay más productos de esa categoría en el carrito
                const categoria = productoEnCarrito.categoria;
                if (!this.productos.some(prod => prod.categoria === categoria)) {
                    const categoriaIndex = this.categorias.indexOf(categoria);
                    this.categorias.splice(categoriaIndex, 1);
                }
            }

            // Actualizo el precio total
            const producto = findProductBySku(sku);
            this.precioTotal -= producto.precio * cantidad;

            resolve();
        });
    }
}

// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
    sku;       // Identificador único del producto
    nombre;    // Su nombre
    cantidad;  // Cantidad de este producto en el carrito

    constructor(sku, nombre, cantidad) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }
}

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = productosDelSuper.find(product => product.sku === sku);
            if (foundProduct) {
                resolve(foundProduct);
            } else {
                reject(`Producto ${sku} no encontrado`);
            }
        }, 1500);
    });
}

const carrito = new Carrito();
carrito.agregarProducto('WE328NJ', 2)
    .then(() => {
        console.log("Producto agregado al carrito");
        console.log("Carrito:", carrito);
    })
    .catch(error => {
        console.error("ERROR NO SE PUDO AGREGAR PRODUCTO");
    });

carrito.eliminarProducto('WE328NJ', 1)
    .then(() => {
        console.log("Producto eliminado del carrito");
        console.log("Carrito:", carrito);
    })
    .catch(error => {
        console.error("ERROR NO SE PUDO ELIMINAR PRODUCTO");
    });
