import {Router} from 'express'
import mongoose from 'mongoose'
import { cartsModel } from '../models/carts.model.js'
import { productModel } from '../models/product.model.js'
const router = Router()
router.post("/", async (req,res)=> {
  try {
    const cart = req.body
    const existingProducts = await productModel.find({})
    let correctProducts = [];
    req.body.products.forEach(reqProduct => {
      if (!existingProducts.some(existingProduct => existingProduct.name === reqProduct.name)) {
          correctProducts.push(reqProduct);
      }
    });
    const products = await productModel.insertMany(correctProducts);
    const productNames = req.body.products.map((product) => product.name);
    const productsToCart = products.filter((product) =>
    productNames.includes(product.name)
    );
    cart.products = productsToCart.map(product => product._id);
    const result = await cartsModel.create(cart);

    if (result) {
      res.status(200).send({ message: "Carrito creado con productos" });
    }
  } catch (error) {
    console.error("No se pudo agregar el carrito " + error);
    res.status(500).send({ error: "No se pudo agregar el carrito", message: error });
  }
})
router.delete("/:cid/products/:pid", async (req,res)=> {
  const ObjectId = mongoose.Types.ObjectId;
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const cart = await cartsModel.findOne({ _id: cid});
        console.log(cart)
        if (cart) {
          if (!ObjectId.isValid(pid)) {
            return res.status(400).send({ status: "error", message: "pid no es un ObjectId válido." });
          } else {
            const result = await cartsModel.updateOne(
              { _id: cid },
               { $pull: { products: new ObjectId(pid) } }
             );
             if (result.modifiedCount === 1) {
               res.status(202).send({ status: "success", payload: result });
             } else {
               res.status(202).send({ status: "error", payload: result });
             }
          }

        } else {
            res.status(202).send({ status: "error"});
        }

    } catch (error) {
        console.error("No se pudo eliminar productos: " + error);
        res.status(500).send({ error: "No se pudo eliminar productos con moongose", message: error });
    }
})
router.put("/:cid", async (req,res)=> {
    try {
        const cid = req.params.cid
        const result = await cartsModel.updateOne({_id: cid}, { $set: { products: req.body.products } })
        if (result.nModified === 0) {
            return res.status(404).send({ message: 'Carrito de compra no encontrado o no se realizó ninguna modificación.' });
        }
        res.status(200).send({ message: 'Carrito de compra actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar el carrito de compra:', error);
    res.status(500).send({ message: 'Error interno del servidor' });
    }
}) 
router.put("/:cid/products/:pid", async (req,res)=> {
    const cid = req.params.cid
    const pid = req.params.pid
    try {
        // Busca el carrito de compra por su ID
        const cart = await cartsModel.findOne({ _id: cid });
    
        if (!cart) {
          return res.status(404).send({ message: 'Carrito de compra no encontrado.' });
        }
    
        // Busca el producto en el carrito por su ID
        const productIndex = cart.products.findIndex(product => product._id === pid);
    
        if (productIndex === -1) {
          return res.status(404).send({ message: 'Producto no encontrado en el carrito.' });
        }
    
        // Actualiza la cantidad del producto
        cart.products[productIndex].quantity = updatedQuantity;
    
        // Guarda los cambios en el carrito de compra
        await cart.save();
    
        res.status(200).send({ message: 'Cantidad de producto actualizada con éxito', data: cart });
      } catch (error) {
        console.error('Error al actualizar la cantidad de producto en el carrito:', error);
        res.status(500).send({ message: 'Error interno del servidor' });
      }
})
router.delete("/:cid", async (req,res)=> {
    const cid = req.params.cid
    try {
        let result = await cartsModel.updateOne({_id : cid}, {$set : {products : []}})
        if (result.nModified === 0) {
            return res.status(404).send({ message: 'Carrito de compra no encontrado o no se realizó ninguna modificación.' });
          }
          res.status(200).send({ message: 'Todos los productos del carrito han sido eliminados con éxito' });
        } catch (error) {
          console.error('Error al eliminar todos los productos del carrito:', error);
          res.status(500).send({ message: 'Error interno del servidor' });
        }
})
router.get("/:cid", async (req,res)=> {
    const cid = req.params.cid
    try {
        let cart = await cartsModel.findOne({_id: cid}).populate('products')
        if (!cart) {
            return res.status(404).send({ message: 'Carrito de compra no encontrado.' });
          }
        res.status(200).send({data: cart})
    } catch (error) {
        console.error('Error al obtener el carrito de compra:', error);
        res.status(500).send({ message: 'Error interno del servidor' });
    }
})
export default router