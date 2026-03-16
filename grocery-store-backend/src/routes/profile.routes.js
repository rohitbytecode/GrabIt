import express from 'express';
import { protect } from '../middleware/authmiddleware.js';
import upload from '../utils/upload.js';
import {
    getProfile,
    updateProfile,
    changePassword,
    uploadProfilePicture
} from '../controllers/profile.controller.js';

const router = express.Router();

// Apply the protect middleware to all routes in this file
router.use(protect);

router.route('/')
    .get(getProfile)
    .put(updateProfile);

router.put('/password', changePassword);

// Profile picture upload endpoint using upload middleware
router.post('/picture', upload.single('profilePicture'), uploadProfilePicture);

export default router;
