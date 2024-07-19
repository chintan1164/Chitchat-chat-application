import express from 'express';
import { register, login, logout, getOtherUser, editUser, changePassword, updateProfilePhoto, getNewUser } from '../controllers/userController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/").get(isAuthenticated, getOtherUser);
router.route("/new").get(isAuthenticated, getNewUser);
router.put('/update', editUser);
router.put('/changepassword', changePassword);
router.put('/updatephoto/:userId', updateProfilePhoto);

export default router;