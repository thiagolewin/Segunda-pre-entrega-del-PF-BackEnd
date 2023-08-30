import mongoose from 'mongoose';

const productCollection = 'Product';


// definimos el schema 
const productSchema  = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number
})


// Definimos el modelo
export const productModel = mongoose.model(productCollection, productSchema );