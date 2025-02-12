import Book from '../models/book.model.js';
// import { BorrowTransaction } from '../models/borrow.model.js';
import { User } from '../models/user.model.js';
import mongoose from 'mongoose';
import BorrowRecord from '../models/borrow.model.js';

// Borrow a book
// export const borrowBook = async (req, res) => {
//   const { userId, bookIds } = req.body;

//   if (!userId || !bookIds || bookIds.length === 0) {
//     return res.status(400).json({ message: 'User ID and at least one book ID are required' });
//   }

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Check if the user exists
//     const user = await User.findById(userId).session(session);
//     if (!user) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Check if books exist and are available
//     const books = await Book.find({ _id: { $in: bookIds }, available: true }).session(session);
//     if (books.length !== bookIds.length) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ message: 'Some books are unavailable or do not exist' });
//     }

//     // Create a single borrow transaction with multiple books
//     const borrowTransaction = new BorrowTransaction({
//       userId,
//       bookIds,  
//       status: 'borrowed',
//     });

//     await borrowTransaction.save({ session });

//     // Mark books as borrowed
//     await Book.updateMany({ _id: { $in: bookIds } }, { available: false }, { session });

//     await session.commitTransaction();
//     session.endSession();

//     res.status(200).json({ message: 'Books borrowed successfully' });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

export const borrowBook = async (req, res) => {
  try {
    const {bookIds } = req.body;
    const userId = req.user._id;

    const books = await Book.find({
      _id: { $in: bookIds },
      available: true
    });

    if (books.length !== bookIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some books are not available'
      });
    }

    const borrowRecords = await Promise.all(
      books.map(async (book) => {
        const record = await BorrowRecord.create({
          user: userId,
          book: book._id
        });
        await Book.findByIdAndUpdate(book._id, { available: false });
        return record;
      })
    );

    res.status(200).json({
      success: true,
      message: 'Books borrowed successfully',
      borrowRecords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Borrowing failed',
      error: error.message
    });
  }
};



// Return books
// export const returnBook = async (req, res) => {
//   const { userId, bookIds } = req.body;
//   console.log("Return Request:", req.body);

//   console.log("req.body",req.body)

//   if (!userId || !bookIds || bookIds.length === 0) {
//     return res.status(400).json({ message: 'User ID and at least one book ID are required' });
//   }

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Find borrow transactions for user and books
//     const transactions = await BorrowTransaction.find({
//       userId,
//       bookId: { $in: bookIds },
//       status: 'borrowed',
//     }).session(session);

//     console.log("transactions",transactions)

//     if (transactions.length !== bookIds.length) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ message: 'Some books are not borrowed by this user' });
//     }

//     // Update transactions to 'returned' and set return date
//     await BorrowTransaction.updateMany(
//       { userId, bookId: { $in: bookIds }, status: 'borrowed' },
//       { $set: { status: 'returned', returnDate: new Date() } },
//       { session }
//     );

//     // Mark books as available again
//     await Book.updateMany({ _id: { $in: bookIds } }, { available: true }, { session });

//     await session.commitTransaction();
//     session.endSession();

//     res.status(200).json({ message: 'Books returned successfully' });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

export const returnBook = async (req, res) => {
  try {
    const {bookIds } = req.body;
    const userId = req.user._id;

    const updates = await Promise.all(
      bookIds.map(async (bookId) => {
        const record = await BorrowRecord.findOneAndUpdate(
          {
            book: bookId,
            user: userId,
            status: 'borrowed'
          },
          {
            status: 'returned',
            returnDate: new Date()
          },
          { new: true }
        );

        if (record) {
          await Book.findByIdAndUpdate(bookId, { available: true });
        }

        return record;
      })
    );

    res.status(200).json({
      success: true,
      message: 'Books returned successfully',
      updates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Return failed',
      error: error.message
    });
  }
};
