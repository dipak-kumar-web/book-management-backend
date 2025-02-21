// import asyncHandler from 'express-async-handler';
// import Book from '../models/book.model.js';
// // import Book from '../models/Book.js';

import Book from "../models/book.model.js";

// // @desc    Get all books
// // @route   GET /api/v1/books
// // @access  Public
// export const getBooks = asyncHandler(async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const skip = (page - 1) * limit;

//   const books = await Book.find()
//     .skip(skip)
//     .limit(limit)
//     .sort({ title: 1 });

//   res.json({
//     success: true,
//     count: books.length,
//     data: books
//   });
// });

// // @desc    Create a book
// // @route   POST /api/v1/books
// // @access  Admin
// export const createBook = asyncHandler(async (req, res) => {
//   const book = await Book.create(req.body);
//   res.status(201).json({ success: true, data: book, message: 'Book created', });
// });



// @desc    Add a new book
// @route   POST /api/books
export const addBook = async (req, res) => {
  try {
    const { title, author, genre, publishedYear, available } = req.body;

    if (!title || !author || !genre || !publishedYear) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBook = new Book({ title, author, genre, publishedYear, available });
    await newBook.save();

    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all books
// @route   GET /api/books
// export const getAllBooks = async (req, res) => {
//   try {
//     const books = await Book.find().sort({ createdAt: -1 });
//     res.status(200).json(books);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

export const getAllBooks = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query; // Get page and limit from query params

    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    // Fetch books with pagination
    const books = await Book.find()
      .sort({ createdAt: -1 }) // Sorting by newest first
      .skip(skip)
      .limit(limit);

    // Get total count for pagination metadata
    const totalBooks = await Book.countDocuments();

    res.status(200).json({
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: page,
      books
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// @desc    Search books by title or author
// @route   GET /api/books/search
export const searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    // console.log(query);
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const books = await Book.find({
      $text: { $search: query }
    });

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update book details
// @route   PUT /api/books/:id
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

