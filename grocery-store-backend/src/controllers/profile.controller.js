import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update user profile details
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const {
            name,
            phoneNumber,
            address,
            dateOfBirth,
            gender
        } = req.body;

        // Update basic fields
        if (name) user.name = name;
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
        if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
        if (gender !== undefined) user.gender = gender;

        // Update address fields (merge new with old)
        if (address) {
            user.address = {
                street: address.street !== undefined ? address.street : user.address.street,
                city: address.city !== undefined ? address.city : user.address.city,
                state: address.state !== undefined ? address.state : user.address.state,
                zipCode: address.zipCode !== undefined ? address.zipCode : user.address.zipCode,
                country: address.country !== undefined ? address.country : user.address.country,
            };
        }

        const updatedUser = await user.save();

        // Send back user without password
        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.status(200).json({ success: true, user: userResponse });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Change user password
// @route   PUT /api/profile/password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Please provide both current and new password' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await user.matchPassword(currentPassword);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect current password' });
        }

        // The pre-save hook in User model will hash the new password
        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Upload or update profile picture
// @route   POST /api/profile/picture
// @access  Private
const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image provided' });
        }

        const profilePicturePath = `/uploads/${req.file.filename}`;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.profilePicture = profilePicturePath;
        await user.save();

        res.status(200).json({ success: true, profilePicture: profilePicturePath });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export {
    getProfile,
    updateProfile,
    changePassword,
    uploadProfilePicture
};
