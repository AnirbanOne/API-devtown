import mongoose from "mongoose";

// Create a book schema (Schema is basically the blue print)
const AuthorSchema = mongoose.Schema(
    {
        id: Number,
        name: String,
        books: [String]
    }
);

const AuthorModel = mongoose.model("authors", AuthorSchema);

export default AuthorModel;