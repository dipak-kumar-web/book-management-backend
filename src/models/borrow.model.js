import mongoose from "mongoose";

// const borrowTransactionSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     bookIds: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Book",
//         required: true,
//       },
//     ],
//     borrowDate: {
//       type: Date,
//       default: Date.now,
//     },
//     returnDate: {
//       type: Date,
//     },
//     status: {
//       type: String,
//       enum: ["borrowed", "returned"],
//       default: "borrowed",
//     },
//   },
//   { timestamps: true }
// );

// // Ensure returnDate is required when status is "returned"
// borrowTransactionSchema.pre("save", function (next) {
//   if (this.status === "returned" && !this.returnDate) {
//     return next(new Error("returnDate is required when status is 'returned'"));
//   }
//   next();
// });

// // Create indexes for faster lookups
// borrowTransactionSchema.index({ userId: 1, status: 1 });
// borrowTransactionSchema.index({ bookIds: 1, status: 1 });

// export const BorrowTransaction = mongoose.model(
//   "BorrowTransaction",
//   borrowTransactionSchema
// );


const borrowRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  borrowDate: {
    type: Date,
    default: Date.now
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned'],
    default: 'borrowed'
  }
}, { timestamps: true });

// Index for querying borrowed books by user
borrowRecordSchema.index({ user: 1, status: 1 });

const BorrowRecord = mongoose.model('BorrowRecord', borrowRecordSchema);

export default BorrowRecord;