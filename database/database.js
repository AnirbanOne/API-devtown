const books = [{
    ISBN: "12345",
    title: "Tesla",
    pubDate: "2021-08-05",
    language: "en",
    numPage: 250,
    author: [1, 2],
    publication: [1],
    category: ["tech", "space", "education"]
}];

const authors = [
    {
        id: 1,
        name: "Aradhana",
        books: ["12345", "secretBook"]
    },
    {
        id: 2,
        name: "Elon Musk",
        books: ["12345"]
    }
];

const publication = [
    {
        id: 1,
        name: "Writex",
        books: ["12345"]
    },
    {
        id: 2,
        name: "blob",
        books: [],
    }
]



export {books, authors, publication};