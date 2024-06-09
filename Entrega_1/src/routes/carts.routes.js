import { Router } from "express";
const router = Router();

const carts = [];

// Ruta para crear un carrito y añadir productos
router.post("/", (req, res) => {
  const { product, quantity } = req.body;

  if (!product || !quantity) {
    return res.status(400).json({ error: "Se requiere producto y cantidad" });
  }

  // Crear un nuevo carrito:
  let cid = carts.length > 0 ? carts[carts.length - 1].cid + 1 : 1;
  let cart = carts.find((c) => c.cid === cid);

  // Si el carrito ya existe, actualizamos la cantidad
  if (cart) {
    let prodAgregado = cart.items.find((i) => i.product === product);

    if (prodAgregado) {
      prodAgregado.quantity += quantity;
    } else {
      cart.prodsAgregado.push({ product, quantity });
    }
  } else {
    // Si no existe, creamos un nuevo carrito
    carts.push({ cid, prodsAgregado: [{ product, quantity }] });
  }

  res.status(200).json({ message: "Producto añadido al carrito", cid });
});
 
//Ruta que no esta definida, da un aviso:
router.get('*', (req,res)=>{
  res.status(404).send('Ruta no definida')
  
})
export default router;