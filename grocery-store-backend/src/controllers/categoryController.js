import Category from '../models/Category.js';
import Product from '../models/Product.js';

const getCategories = async (req, res) => {
    const cats = await Category.find();
    const results = await Promise.all(cats.map(async (c) => {
        const productCount = await Product.countDocuments({ categoryId: c._id });
        return { id: c._id, name: c.name, description: c.description, image: c.image, productCount };
    }));
    res.json(results);
};

const getCategoryById = async (req, res) => {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ success:false, message: 'Category not found' });
    res.json(cat);
};

const createCategory = async (req, res) => {
    const cat = await Category.create(req.body);
    res.json({ success: true, data: cat });
};

const updateCategory = async (req, res) => {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cat) return res.status(404).json({ success:false, message: 'Category not found' });
    res.json({ success: true, data: cat });
};

const deleteCategory = async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true });
};

export { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
