import Contact from '../models/Contact.js';

const submitContact = async (req, res) => {
    const { name, email, message } = req.body;
    await Contact.create({ name, email, message });
    res.json({ success: true, message: 'Message sent successfully' });
};

export { submitContact };
