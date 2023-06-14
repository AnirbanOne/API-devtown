import express from "express";
import * as data from "./database/database.js";
import mongoose from "mongoose";
import { get } from "https";
import bodyParser from "body-parser";
import { log } from "console";
import "dotenv/config";

// Importing the models
import BookModel from "./database/book.js";
import PubModel from "./database/publication.js";
import AuthorModel from "./database/author.js";

// Initialize express => Book Management Project
const booky = express();
booky.use(bodyParser.urlencoded({ extended: true }));
booky.use(bodyParser.json());

//Connect Mongoose
//Schema: Blueprint of something is schema
//MongoDB: It doesn't has schema
//Mongoose has schema!
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //   useFindAndModify: false,
    //   useCreateIndex: true,
  })
  .then(() => {
    console.log("Connection has been established");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// get All the books
booky.get("/books", async (req, res) => {
  const getAllBooks = await BookModel.find();

  return res.json(getAllBooks);
});

// Get the books based on there ISBN
booky.get("/is/:isbn", async (req, res) => {
  const getAllBooks = await BookModel.findOne({ ISBN: req.params.isbn }); // ? findOne is a function of the MongoDB where it just return only one value not many!

  //     const getSpecificBook = data.books.filter((book) => {
  //     return book.ISBN === req.params.isbn;
  //   });

  // ? In MongoDb if a data is not present in the database then it return a null value hence, (!0 = 1)
  if (!getAllBooks) {
    return res.json({ error: `No book found for the ISBN ${req.params.isbn}` }); //To include an expression in an template literal
  }

  return res.json(getAllBooks);
});

// Get the books based on category
booky.get("/c/:category", async (req, res) => {
  //   const getSpecificBook = data.books.filter((book) => {
  //     return book.category.includes(req.params.category);
  //   });

  const getAllBooks = await BookModel.find({
    category: req.params.category,
  }); // ? findOne is a function of the MongoDB where it just return only one value not many!

  // ? In MongoDb if a data is not present in the database then it return a null value hence, (!0 = 1)
  if (!getAllBooks) {
    return res.json({
      error: `No book found for the Category: ${req.params.category}`,
    }); //To include an expression in an template literal
  }

  return res.json(getAllBooks);
});

booky.get("/l/:language", async (req, res) => {
  const getAllBooks = await BookModel.find({
    language: req.params.language
  })

  if(!getAllBooks) {
    res.json({
        error: `No book found for the Language: ${req.params.language}`,
    });
  }

  return res.json(getAllBooks);
});

// ! Authors

booky.get("/authors", async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json(getAllAuthors);
});

booky.get("/authors/:id", async (req, res) => {
  const getAuthors = await AuthorModel.find({
    id: req.params.id
  });

  if (!getAuthors) {
    res.json({ error: `The author with id: ${req.params.id} doesn't exists` });
  } else {
    res.json(getAuthors);
  }
});

booky.get("/authors/book/:isbn", async (req, res) => {
  const getAuthor = await AuthorModel.find({books: req.body.isbn})

  if (!getAuthor) {
    res.json({ error: `The book with ${req.params.isbn} doesn't exists` });
  } else {
    res.json(getAuthor);
  }
});

// ! Publication

booky.get("/publish", async (req, res) => {
  const getAllPublications = await PubModel.find();
  return res.json(getAllPublications);
});

booky.get("/publish/:id", async (req, res) => {
  const getPublication = await PubModel.find({id: req.params.id});

  if (!getPublication) {
    res.json({ error: `The publication with ${req.params.id} doesn't exists` });
  } else {
    res.json(getPublication);
  }
});

booky.get("/publish/books/:isbn", async (req, res) => {
  const getPublication = await PubModel.find({books: req.params.isbn});

  if (!getPublication) {
    res.json({ error: `The publication with ${req.params.id} doesn't exists` });
  } else {
    res.json(getPublication);
  }
});

// ! Post Request
// Add new book
// Add new Author
// Add new publication

booky.post("/book/new", async (req, res) => {
  const newBook = req.body; //Storing the data in json format
  const addNewBook = await BookModel.create(newBook); //To add the books we nned to use the create method
  return res.json({
    book: addNewBook,
    message: "Book has been added!",
  });
});

booky.post("/author/new", async (req, res) => {
  const newAuthor = req.body;
  const addNewAuthor = await AuthorModel.create(newAuthor); //To add the author we nned to use the create method
  return res.json({
    author: addNewAuthor,
    message: "Author has been added!",
  });
});

booky.post("/publish/new", async (req, res) => {
  const newPublication = req.body;
  const addNewPublication = await PubModel.create(newPublication);
  return res.json({
    publication: newPublication,
    message: "Publication has been added!"
  });
});

// ! Update Book Details

//PUT request:
// ! Update book details
booky.put("/books/update/:isbn", async (req, res) => {
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            title: req.body.bookTitle
        },
        {
            new: true //This is important to write in case your updating to get the object updated in the mongoDb
        }
    );

    return res.json({
        book: updatedBook,
        message: "Book has been updated"
    });
});

// ! Update the author
booky.put("/books/author/update/:isbn", async (req, res) => {
    // Update book database
    const updateBook = await BookModel.findOneAndUpdate(
        {ISBN: req.params.isbn},
        { $addToSet: {author: req.body.author}},
        {new: true}
    )
    // update Author database
    const updateAuthor = await AuthorModel.findOneAndUpdate(
        {id: req.params.author},
        { $addToSet: {books: req.params.isbn}},
        {new: true}
    )

    return res.json({
        book: updateBook,
        author: updateAuthor,
        message: "Author updated successfully"
    })
})

// ! Update publication: Publication can have more than one books when required.
booky.put("/publication/update/book/:isbn", async (req, res) => {
  // Update the publication database using node.js
//   data.publication.forEach((pub) => {
//     if (pub.id === req.body.pubId) {
//       return pub.books.push(req.params.isbn);
//     }
//   });

//   data.books.forEach((book) => {
//     if (book.ISBN === req.params.isbn) {
//       book.publication = req.body.pubId;
//     }
//   });

//   return res.json({
//     books: data.books,
//     publications: data.publication,
//     message: "Updated successfully",
//   });

//   Update the publication database using mongoDB
const publicationBooks = await PubModel.findOneAndUpdate(
    { id: req.body.pubID },
    { $addToSet: { books: req.body.isbn } },
    {new: true}  
  );
  

const booksPublication = await BookModel.findOneAndUpdate(
    { ISBN: req.params.isbn},
    {publication: req.body.pubID},
    {new: true}
);

return res.json({
    books: booksPublication,
    publication: publicationBooks,
    message: "Updated successfully",
})
});

// ! DELETE
// Delete a book
// Delete an author
// Delete an related book from author

booky.delete("/book/delete/:isbn", async (req, res) => {
  // use filter and pass the books with selected isbn to an array

//   const updateDatabase = data.books.filter((book) => {
//     return book.ISBN !== req.params.isbn;
//   });

const deleteBook = await BookModel.findOneAndDelete(
    { ISBN: req.params.isbn}
);

  // data.books = updateDatabase;
  return res.json({
    book: deleteBook,
  });
});

booky.delete("/book/delete/author/:isbn/:authorID", async (req, res) => {
  // Update the book database

//   data.books.forEach((book) => {
//     if (book.ISBN === req.params.isbn) {
//       const updateAuthorinBook = book.author.filter(
//         (eachauthor) => eachauthor !== parseInt(req.params.authorID)
//       );
//       book.author = updateAuthorinBook;
//       return;
//     }
//   });

  // Update the Author database
//   data.authors.forEach((author) => {
//     if (author.id === parseInt(req.params.authorID)) {
//       const updateBooksinAuthor = author.books.filter(
//         (eachBook) => eachBook !== req.params.isbn
//       );
//       author.books = updateBooksinAuthor;
//       return;
//     }
//   });

const updateAuthorinBook = await BookModel.findOneAndUpdate(
    {ISBN: req.params.isbn},
    {
        $pull: {author: req.params.authorID}
    },
    {
        new: true
    }
);

const updateBookinAuthor = await AuthorModel.findOneAndUpdate(
    {id: req.params.authorID},
    {
        $pull: {books: req.params.isbn}
    },
    {
        new: true
    }
);

  return res.json({
    book: updateAuthorinBook,
    author: updateBookinAuthor,
  });
});

booky.listen(8800, () => {
  console.log("Server Running!");
});

//Books
// ISBN, Title, Publication Date, Language, numPage, author[], category[]

// Authors
// Author ID, Name, books[]

// Publications
// Id, name, books[]
