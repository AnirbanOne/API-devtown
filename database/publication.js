import mongoose from "mongoose";

// Create a book schema (Schema is basically the blue print)
const PubSchema = mongoose.Schema(
    {
        id: Number,
        name: String,
        books: [String]
    }
);

const PubModel = mongoose.model("publication", PubSchema);

export default PubModel;