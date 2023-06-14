import mongoose from "mongoose";

// Create a book schema (Schema is basically the blue print)
const BookSchema = mongoose.Schema(
    {
        ISBN: String,
        title: String,
        pubDate: String,
        language: String,
        numPage: Number,
        author: [Number],
        publication: [Number],
        category: [String]
    }
);

const BookModel = mongoose.model("books", BookSchema);

export default BookModel;