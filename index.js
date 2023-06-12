import express from 'express';
import * as data from './database.js';
import { get } from 'https';
import bodyParser from 'body-parser';

// Initialize express => Book Management Project
const booky = express();
booky.use(bodyParser.urlencoded({ extended: true }));
booky.use(bodyParser.json());

// get All the books
booky.get("/books", (req, res) => {
    return res.json(data.books)
})

// Get the books based on there ISBN
booky.get("/is/:isbn", (req, res) => {
    const getSpecificBook = data.books.filter(
        (book)=> {
            return book.ISBN === req.params.isbn;
        }
    );

    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the ISBN ${req.params.isbn}`}) //To include an expression in an template literal
    }

    return res.json(getSpecificBook);
});

// Get the books based on category
booky.get("/c/:category", (req, res) =>{
    const getSpecificBook = data.books.filter(
        (book) => {
            return book.category.includes(req.params.category);
        }
    );

    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the Category of ${req.params.category}`}) //To include an expression in an template literal
    } else{
        return res.json(getSpecificBook);
    }
});

booky.get("/l/:language", (req, res)=>{
    const getSpecificBook = data.books.filter(
        (book) => {
           return book.language === req.params.language;
        }
    );

    if(getSpecificBook.length === 0){
       return res.json({error: `The book with language ${req.params.language} doesn't exists`});
    } else {
       return res.json(getSpecificBook);
    }
});


// ! Authors

booky.get("/authors", (req, res)=>{
    res.json({authors: data.authors});
});

booky.get("/authors/:id", (req,res)=>{
    const getAuthors = data.authors.filter(
        (author) => {
            return author.id === parseInt(req.params.id);
        }
    )

    if (getAuthors.length === 0) {
        res.json({error: `The author with id: ${req.params.id} doesn't exists`});
    } else{
        res.json(getAuthors);
    }
})

booky.get("/authors/book/:isbn", (req, res)=>{
    const getAuthor = data.authors.filter(
        author => {
           return author.books.includes(req.params.isbn);
        }
    );

    if(getAuthor.length === 0){
        res.json({error: `The book with ${req.params.isbn} doesn't exists`});
    } else {
        res.json(getAuthor);
    }
})

// ! Publication

booky.get("/publish", (req, res) => {
    res.json({publication: data.publication});
});

booky.get("/publish/:id", (req, res) => {
    const getPublication = data.publication.filter(
        published => {return published.id === parseInt(req.params.id);}
    );

    if (getPublication.length === 0) {
        res.json({error: `The publication with ${req.params.id} doesn't exists` });      
    } else {
        res.json(getPublication);
    }
})

booky.get("/publish/books/:isbn", (req, res) => {
    const getPublication = data.publication.filter(
        published => {return published.books.includes(req.params.isbn);}
    );

    if (getPublication.length === 0) {
        res.json({error: `The publication with ${req.params.id} doesn't exists` });      
    } else {
        res.json(getPublication);
    }
})


// ? Post Request 
// Add new book
// Add new Author
// Add new publication

booky.post("/book/new", (req, res)=>{
    const newBook = req.body;
    data.books.push(newBook);
    return res.json(data.books);
})

booky.post("/author/new", (req, res) => {
    const newAuthor = req.body;
    data.authors.push(newAuthor);
    return res.json(data.authors);
});

booky.post("/publish/new", (req, res) => {
    const newPublication = req.body;
    data.publication.push(newPublication);
    return res.json(data.publication);
})

// ! Update Book Details

//PUT request:

// Update publication: Publication can have more than one books when required.
booky.put("/publication/update/book/:isbn" , (req, res)=>{
    // Update the publication database
    data.publication.forEach((pub)=> {
        if(pub.id === req.body.pubId){
            return pub.books.push(req.params.isbn);
        }
    })

    data.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn){
            book.publication = req.body.pubId;
        }
    })

    return res.json(
        {
            books: data.books,
            publications: data.publication, 
            message: "Updated successfully",
        }
    )
});

// DELETE
// Delete a book
// Delete an author
// Delete an related book from author 

booky.delete("/book/delete/:isbn", (req, res)=>{
    // use filter and pass the books with selected isbn to an array

    const updateDatabase = data.books.filter((book)=>{
        return book.ISBN !== req.params.isbn;
    })

    // data.books = updateDatabase;
    return res.json({
        book: updateDatabase
    })
})

booky.delete("/book/delete/author/:isbn/:authorID", (req, res)=>{
    // Update the book database
    data.books.forEach((book)=>{ 
        if(book.ISBN === req.params.isbn){
            const updateAuthorinBook =  book.author.filter((eachauthor)=> eachauthor !== parseInt(req.params.authorID));
            book.author = updateAuthorinBook;
            return;
        }
})
    // Update the Author database
    data.authors.forEach((author)=>{
        if(author.id === parseInt(req.params.authorID)){
            const updateBooksinAuthor = author.books.filter(
                (eachBook) => eachBook !== req.params.isbn
            );
            author.books = updateBooksinAuthor;
            return;
        } 
    })
 return res.json({
    book: data.books,
    author: data.authors
 })
})

booky.listen(8800, ()=>{
    console.log("Server Running!");
})

//Books
// ISBN, Title, Publication Date, Language, numPage, author[], category[]


// Authors
// Author ID, Name, books[]

// Publications
// Id, name, books[]