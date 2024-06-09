import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

const productsFilePath = path.resolve("./src/data/products.json");

const getProducts = () => {
  try {
    const data = fs.readFileSync(productsFilePath, "utf-8");
    return JSON.parse(data) || [];
  } catch (error) {
    console.log("Error al leer los productos", error);
    return [];
  }
};
const guardarProducts = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};
//Ruta para traer los productos cuando se carguen al servidor
router.get("/", (req, res) => {
  const products = getProducts();
  res.json(products);
});
//Ruta para cargar un producto
router.post("/", (req, res) => {
  const { title, description, code, price, stock, category, img } = req.body;
  //control que se ingresen todos los datos:
  if (
    !title ||
    !description ||
    !code ||
    !price ||
    !stock ||
    !category ||
    !img
  ) {
    return res
      .status(400)
      .json({ error: "deben ingresarse todos los campos del producto" });
  }
  //se leen los productos actuales
  const products = getProducts();

  //asignamos el id unico, autoincrementable:
  const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
  const newProduct = { id, title, description, code, price, stock, category, img }
  products.push(newProduct);

  //guardar lista actualizada de productos:
guardarProducts(products);
  res.status(200).json({ id });
});

//ruta para modificacion de algun producto:
router.put("/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const newInfo = req.body;

  //leer los productos desde el json:
  const products= getProducts();

  const product = products.find((p) => p.id === productId);
  if (product) {
    Object.assign(product, newInfo);
    guardarProducts(products);
    return res
      .status(200)
      .json({ message: "producto actualizado correctamente" });
  } else {
    return res.status(400).json({ message: "no existe el id " });
  }
});

//ruta para eliminar algun producto:

router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  //Buscar el producto en el json:
  const products = getProducts();
  const productIndex = products.findIndex((p) => p.id === id);

  if (productIndex !== -1) {
    products.splice(productIndex, 1);
    //guardar cambio:
    guardarProducts(products);
    res.send(`El producto con id ${id} fue eliminado con éxito`);
  } else {
    res.status(404).json({ error: "Producto NO ENCONTRADO" });
  }
});

// Ruta que no está definida, da un aviso:
router.get("*", (req, res) => {
  res.status(404).send("Ruta no definida");
});

export default router;
