import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const cartsFilePath = path.resolve("./src/data/carts.json");
const productsFilePath = path.resolve("./src/data/products.json");

const getCarts = () => {
  try {
    const data = fs.readFileSync(cartsFilePath, "utf-8");
    return JSON.parse(data) || [];
  } catch (error) {
    console.error("Error lectura archivo carrito:", error);
    return [];
  }
};

const saveCarts = (carts) => {
  try {
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
  } catch (error) {
    console.error("Error al guardar en el archivo carritos:", error);
  }
};

const getProducts = () => {
  try {
    const data = fs.readFileSync(productsFilePath, "utf-8");
    return JSON.parse(data) || [];
  } catch (error) {
    console.error("Error lectura en el archivo products:", error);
    return [];
  }
};

// Ruta para crear un carrito y añadir productos
router.post("/", (req, res) => {
  const { product, quantity } = req.body;

  if (!product || !quantity) {
    return res.status(400).json({ error: "Se requiere producto y cantidad" });
  }

  // Leer carritos
  const carts = getCarts();

  // Verificar si el producto existe
  const products = getProducts();
  const productExists = products.find(p => p.id === product);
  if (!productExists) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  // Buscar un carrito existente o crear uno nuevo
  let cart = carts.find(c => c.prodsAgregado.some(p => p.product === product));
  if (cart) {
    // Si el carrito ya existe, actualizamos la cantidad
    let prodAgregado = cart.prodsAgregado.find(i => i.product === product);
    prodAgregado.quantity += quantity;
  } else {
    // Si no existe, creamos un nuevo carrito
    const cid = carts.length > 0 ? carts[carts.length - 1].cid + 1 : 1;
    carts.push({ cid, prodsAgregado: [{ product, quantity }] });
    cart = carts.find(c => c.cid === cid);
  }

  // Guardar carritos actualizados
  saveCarts(carts);

  res.status(200).json({ message: "Producto añadido al carrito", cid: cart.cid });
});

// Ruta que no está definida, da un aviso
router.get('*', (req, res) => {
  res.status(404).send('Ruta no definida');
});

export default router;

