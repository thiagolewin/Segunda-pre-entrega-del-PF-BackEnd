import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'
const cartCollection = 'carts';


// definimos el schema 
const cartSchema  = new mongoose.Schema({
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
})

cartSchema.plugin(mongoosePaginate)
// Definimos el modelo
export const cartsModel = mongoose.model(cartCollection, cartSchema );