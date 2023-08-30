import mongoose from 'mongoose';

const cartCollection = 'carts';


// definimos el schema 
const cartSchema  = new mongoose.Schema({
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
})


// Definimos el modelo
export const cartsModel = mongoose.model(cartCollection, cartSchema );