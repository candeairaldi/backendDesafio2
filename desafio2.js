const fs = require("fs");

class ProductManager {
  constructor() {
    this.products = [];
    this.path = "products.json";
    this.readProductsFromFile();
    this.currentId = 1; // Inicializa el contador para IDs
  }

  addProduct(product) {
    const { title, description, price, thumbnail, code, stock } = product;
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error('Todos los campos son obligatorios');
    }

    if (this.products.some((p) => p.code === code)) {
      console.log('El código del producto ya existe');
      return;
    }

    const id = this.currentId++; // Genera un ID único
    this.products.push({ id, ...product });

    this.saveProductsToFile();
    console.log("Datos guardados correctamente");
  }

  readProductsFromFile() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      this.products = JSON.parse(data);
      console.log("Archivo leído");
      if (this.products.length > 0) {
        // Encuentra el máximo ID existente y configura el contador en uno más
        const maxId = Math.max(...this.products.map((p) => p.id));
        this.currentId = maxId + 1;
      }
    } catch (error) {
      console.error("Error al leer el archivo", error);
    }
  }

  saveProductsToFile() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
      console.log("Datos guardados correctamente");
    } catch (error) {
      console.error("Error al escribir en el archivo", error);
    }
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      console.error('Producto no encontrado');
    }
    return product;
  }

  updateProduct(id, updatedFields) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }

    this.products[index] = { ...this.products[index], ...updatedFields };
    this.saveProductsToFile();
    console.log("Producto actualizado correctamente");
  }

  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }

    this.products.splice(index, 1);
    this.saveProductsToFile();
    console.log("Producto eliminado correctamente");
  }
}


const productManager = new ProductManager();
console.log("Productos iniciales:", productManager.getProducts());

const productToAdd = {
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
};

productManager.addProduct(productToAdd);
console.log("Productos después de agregar:", productManager.getProducts());

const newProduct = productManager.getProducts()[0];
console.log("Producto obtenido por ID:", productManager.getProductById(newProduct.id));

const updatedFields = { price: 250, stock: 30 };
productManager.updateProduct(newProduct.id, updatedFields);
console.log("Productos después de actualizar:", productManager.getProducts());

try {
  productManager.deleteProduct(newProduct.id);
  console.log("Productos después de eliminar:", productManager.getProducts());
} catch (error) {
  console.error(error.message);
}