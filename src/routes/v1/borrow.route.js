import express from 'express';
import { borrowBook, returnBook } from '../../controllers/borrow.controller.js';
import { auth } from '../../middlewares/auth.middleware.js';


const router = express.Router();

// Borrow a book route
router.post('/borrow', auth, borrowBook);

// Return a book route
router.post('/return', auth,  returnBook);

export default router;