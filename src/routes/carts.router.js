import {Router} from 'express'
import { cartsModel } from '../models/carts.model.js'
const router = Router()

router.delete("/:cid/products/:pid", async (req,res)=> {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const result = await cartsModel.updateOne(
            { _id: cid }, // Filtra el carrito de compra por su ID
            { $pull: { products: { _id: pid } } } // Usa $pull para eliminar el producto por su ID
          );
          if (result.nModified === 1) {
            res.status(202).send({ status: "success", payload: result });
          } else {
            res.status(202).send({ status: "error", payload: result });
          }
    } catch (error) {
        console.error("No se pudo obtener usuarios con moongose: " + error);
        res.status(500).send({ error: "No se pudo obtener usuarios con moongose", message: error });
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