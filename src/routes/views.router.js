import { Router } from 'express';
import { productModel } from '../models/product.model.js';

const router = Router();

router.get('/', async  (req, res) => {
    let query = req.query.query
    let limit = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    let sort = parseInt(req.query.sort) || 1;
    try {
        let result = await productModel.paginate({}, {page,limit,lean: true,sort: { price: sort }});
        result.prevLink = result.hasPrevPage ? `http://localhost:9090/?page=${result.prevPage}&query=${query}&limit=${limit}&sort=${sort}` : '';
        result.nextLink = result.hasNextPage ? `http://localhost:9090/?page=${result.nextPage}&query=${query}&limit=${limit}&sort=${sort}` : '';
        result.isValid = !(page <= 0 || page > result.totalPages)
        result.payload = result.docs  
        res.render('index', result)
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
    

})
router.get('/products', async  (req, res) => {
    let query = req.query.query
    let limit = parseInt(req.query.limit);
    let page = parseInt(req.query.page);
    let sort = parseInt(req.query.sort);
    if (!page) page = 1;
    if (!sort) sort = 1;
    if (!limit) limit = 10;
    try {
        let result = await productModel.paginate({}, {page,limit,lean: true,sort: { price: sort }});
        result.prevLink = result.hasPrevPage ? `http://localhost:9090/products?page=${result.prevPage}&query=${query}&limit=${limit}&page=${page}&sort=${sort}` : '';
        result.nextLink = result.hasNextPage ? `http://localhost:9090/products?page=${result.nextPage}&query=${query}&limit=${limit}&page=${page}&sort=${sort}` : '';
        result.isValid = !(page <= 0 || page > result.totalPages)
        result.status = "succes"   
        result.payload = result.docs  
        res.render('products', result)
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error') 
    }

})


export default router;