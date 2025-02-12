import mongoose from "mongoose";


// Book Schema
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  author: {
    type: String,
    required: true,
    index: true
  },
  genre: {
    type: String,
    required: true
  },
  publishedYear: {
    type: Number,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for search
bookSchema.index({ title: 'text', author: 'text' });

 const Book = mongoose.model('Book', bookSchema);
 export default Book;