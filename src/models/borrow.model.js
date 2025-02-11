import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    borrowedAt: {
        type: Date,
        default: Date.now
    },
    returnedAt: { type: Date },
});

export const Borrow = mongoose.model('Borrow', borrowSchema);