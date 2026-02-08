import Product from '../models/Product.js';

const getProducts = async (req, res) => {
    const {
        categoryId, minPrice, maxPrice, inStock, search, sortBy, sortOrder, page = 1, pageSize = 12
    } = req.query;

    const filter = {};
    if (categoryId) filter.categoryId = categoryId;
    if (minPrice) filter.price = { ...(filter.price||{}), $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...(filter.price||{}), $lte: Number(maxPrice) };
    if (inStock !== undefined) filter.inStock = inStock === 'true';
    if (search) filter.name = { $regex: search, $options: 'i' };

    const sort = {};
    if (sortBy) sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (Number(page)-1) * Number(pageSize);
    const total = await Product.countDocuments(filter);
    const data = await Product.find(filter).sort(sort).skip(skip).limit(Number(pageSize));

    res.json({ data, total, page: Number(page), pageSize: Number(pageSize), totalPages: Math.ceil(total/Number(pageSize)) });
};

const getFeatured = async (req, res) => {
    const data = await Product.find({ featured: true }).limit(12);
    res.json(data);
};

const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success:false, message: 'Product not found' });
    res.json(product);
};

const createProduct = async (req, res) => {
    const body = req.body;
    const product = await Product.create(body);
    res.json({ success: true, data: product, message: 'Product created successfully' });
};

const updateProduct = async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ success:false, message: 'Product not found' });
    res.json({ success: true, data: product, message: 'Product updated successfully' });
};

const deleteProduct = async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success:false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted successfully' });
};

const uploadProductImage = async (req, res) => {
    if (!req.file) return res.status(400).json({ success:false, message: 'No file uploaded' });
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const product = await Product.findByIdAndUpdate(req.params.id, { image: imageUrl }, { new: true });
    res.json({ success: true, data: { imageUrl }, product });
};

export { getProducts, getFeatured, getProductById, createProduct, updateProduct, deleteProduct, uploadProductImage };
