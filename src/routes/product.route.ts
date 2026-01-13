import { Hono } from 'hono';
import {
  getAllProductsHandler,
  getProductByIdHandler,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from '../handlers/product.handler.js';

const router = new Hono();

router.get('/products', getAllProductsHandler);
router.get('/products/:id', getProductByIdHandler);
router.post('/products', createProductHandler);
router.put('/products/:id', updateProductHandler);
router.delete('/products/:id', deleteProductHandler);

export default router;