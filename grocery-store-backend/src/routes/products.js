import express from 'express';
import upload from '../utils/upload.js';
import { protect, authorize } from '../middleware/authmiddleware.js';
import { getProducts, getFeatured, getProductById, createProduct, updateProduct, deleteProduct, uploadProductImage } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeatured);
router.get('/:id', getProductById);

router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
router.post('/:id/image', protect, authorize('admin'), upload.single('image'), uploadProductImage);

export default router;
