import { Router } from "express";
import productoModel from "../models/productos.models.js";

const router = Router();

// Ruta para mostrar todos los productos
router.get("/", async (req, res) => {
    const productos = await productoModel.find().lean().exec()
    res.render("list", { productos })
})

// Ruta para mostrar un solo producto filtrado por nombre
router.get("/:nombre", async (req, res) => {
    try {
        const nombreProducto = req.params.nombre;
        const producto = await productoModel.findOne({ nombre: nombreProducto }).lean().exec();
        
        if (producto) {
            res.render("one", { producto });
        } else {
            res.status(404).send("Producto no encontrado");
        }
    } catch (error) {
        console.log(error);
        res.send("Error al buscar el producto");
    }
});

// Ruta para crear un nuevo producto
router.post("/", async (req, res) => {
    try {
        const productoNew = req.body
        const result = await productoModel.create(productoNew)
        console.log({result})
        res.redirect("/productos")
    } catch (error) {
        console.log(error)
        res.send("Error al crear...")
    }
})

// Ruta para eliminar un producto por su ID
router.delete("/:id", async (req, res) => {
    res.send("Producto Eliminandose...");
})

export default router;
