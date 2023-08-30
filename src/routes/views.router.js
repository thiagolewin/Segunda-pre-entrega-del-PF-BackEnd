import { Router } from 'express';
import { productModel } from '../models/product.model.js';
import studentsModel from '../models/students.js';

const router = Router();

router.get('/', async  (req, res) => {
    let query = parseInt(req.query.query);
    let limit = parseInt(req.query.limit);
    let page = parseInt(req.query.page);
    let sort = parseInt(req.query.sort);
    if (!page) page = 1;
    if (!sort) sort = 1;
    if (!limit) limit = 10;
    try {
        let result = await studentsModel.paginate({query}, {page,limit: limit,lean: true,sort: { price: sort }});
        result.prevLink = result.hasPrevPage ? `http://localhost:9090/?page=${result.prevPage}` : '';
        result.nextLink = result.hasNextPage ? `http://localhost:9090/?page=${result.nextPage}` : '';
        result.isValid = !(page <= 0 || page > result.totalPages)
        result.status = "succes"   
        result.payload = result.docs  
    } catch (error) {
        console.log(error)
        result.status = "error"   
    }
    
    res.render('index', result)
})
router.get('/products', async  (req, res) => {
    let query = parseInt(req.query.query);
    let limit = parseInt(req.query.limit);
    let page = parseInt(req.query.page);
    let sort = parseInt(req.query.sort);
    if (!page) page = 1;
    if (!sort) sort = 1;
    if (!limit) limit = 10;
    try {
        let result = await productModel.paginate({query}, {page,limit: limit,lean: true,sort: { price: sort }});
        result.prevLink = result.hasPrevPage ? `http://localhost:9090/products?page=${result.prevPage}?query=${query}?limit=${limit}?page=${page}?sort=${sort}` : '';
        result.nextLink = result.hasNextPage ? `http://localhost:9090/products?page=${result.nextPage}?query=${query}?limit=${limit}?page=${page}?sort=${sort}` : '';
        result.isValid = !(page <= 0 || page > result.totalPages)
        result.status = "succes"   
        result.payload = result.docs  
    } catch (error) {
        console.log(error)
        result.status = "error"   
    }
    
    res.render('products', result)
})


export default router;