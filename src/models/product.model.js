import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'
const productCollection = 'Product';


// definimos el schema 
const productSchema  = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number
})
productSchema.plugin(mongoosePaginate)

// Definimos el modelo
export const productModel = mongoose.model(productCollection, productSchema );