import express from "express";
const app = express();
const PORT = 8080;

import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";

//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

//Ruta de bienvenia
app.get("/", (req, res) => {
  res.send("Bienvenidos a la tienda FUNKOSHOP");
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

//archivos estaticos, en la carpeta public, y se avisa a express, dandole la ruta:
app.use(express.static("/src/public"));

