import express from "express";
import {
  addBook,
  getAllBooks,
  searchBooks,
  updateBook,
  deleteBook
} from "../../controllers/books.controller.js";
import { ratelimiter } from "../../middlewares/rateLimiter.middleware.js";

const router = express.Router();

router.post("/", ratelimiter, addBook); // Add a new book
router.get("/", ratelimiter, getAllBooks); // Get all books
router.get("/search", ratelimiter,  searchBooks); // Search books by title or author
router.put("/:id", ratelimiter, updateBook); // Update book details
router.delete("/:id", ratelimiter, deleteBook); // Delete a book

export default router;
