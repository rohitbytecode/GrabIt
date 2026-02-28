import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role, email: user.email, name: user.name }, process.env.JWT_TOKEN || process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success:false, message: 'Invalid credentials' });
    const matched = await user.matchPassword(password);
    if (!matched) return res.status(401).json({ success:false, message: 'Invalid credentials' });
    const token = generateToken(user);
    res.json({ success: true, token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
};

const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
        return res.status(409).json({ success: false, message: 'Email already in use' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user);
    res.status(201).json({ success: true, token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
};

const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success:false, message: 'Invalid credentials' });
    if (user.role !== 'admin') return res.status(403).json({ success:false, message: 'Not an admin' });
    const matched = await user.matchPassword(password);
    if (!matched) return res.status(401).json({ success:false, message: 'Invalid credentials' });
    const token = generateToken(user);
    res.json({ success: true, token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
};

export { register, login, adminLogin };
