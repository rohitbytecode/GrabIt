import express from 'express';
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/authmiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);

router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;
