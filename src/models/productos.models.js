import mongoose from "mongoose";

const productosSchema = new mongoose.Schema({
    nombre: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    description: String,
    img: String,
    stock: Number
});

const productoModel = mongoose.model('productos', productosSchema);


export default productoModel;