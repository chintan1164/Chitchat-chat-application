import express from "express";
import { deleteMessage, getMessage, sendMessage, sendPhoto } from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/send/:id").post(isAuthenticated, sendMessage);
router.route("/send-photo/:id").post(isAuthenticated, upload.single('photo'), sendPhoto);
router.route("/:id").get(isAuthenticated, getMessage);
router.route("/delete/:id").delete(isAuthenticated, deleteMessage);

export default router;
