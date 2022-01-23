require("dotenv").config();
const express = require ("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Database
const database = require("./database");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Initialize express
const booky = express();
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

// Establish database connection
mongoose.connect(
  process.env.MONGO_URL
  )
;
// Get all books

booky.get("/", async (req,res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

//Get a specific book  localhost:3000/12345Book
/*
Route         /
Description   Get specific books
Access        Public
Parameter     language
Methods       GET
*/
booky.get("/e/:language", (req,res) => {
const getSpecificBook = database.books.filter(
  (book) => book.language === req.params.language
);

    if(getSpecificBook.length === 0){
      return res.json({
        error: `No book found for language of ${req.params.language}`
      });
    }
    return res.json({book: getSpecificBook});
});

//Get a specific book  localhost:3000/12345Book
/*
Route         /c
Description   Get specific books
Access        Public
Parameter     category
Methods       GET
*/
booky.get("/c/:category",async (req,res) =>{
const getSpecificBook = await BookModel.findOne({category: req.params.category});
//If no specific book is returned the find function returns null and to execute
//found property we have to make the condition inside if true, !null is true

if(!getSpecificBook){
  return res.json({
    error: `No book found for category of ${req.params.category}`
  });
}
return res.json({getSpecificBook});

});


//Get a specific book  localhost:3000/12345Book
/*
Route         /is
Description   Get specific books
Access        Public
Parameter     ISBN
Methods       GET
*/

booky.get("/is/:isbn",async (req,res) => {
const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn})

    if(!getSpecificBook){
      return res.json({
        error: `No book found for ISBN of ${req.params.isbn}`
      });
    }
    return res.json({book: getSpecificBook});
});


//Get all authors
/*
Route         /author
Description   Get all authors
Access        Public
Parameter     None
Methods       GET
*/

booky.get("/author", async (req,res) =>{

  const getAllAuthors = AuthorModel.find();
  return res.json(getAllAuthors);
});

//Get all authors based on books
/*
Route         /author/book
Description   Get all authors based on books
Access        Public
Parameter     ISBN
Methods       GET
*/

booky.get("/author/book/:isbn",async (req,res) =>{

  const getSpecificAuthor = await AuthorModel.findOne({books: req.params.isbn})

if(!getSpecificAuthor.length){
  return res.json({
    error: `No author found for isbn of ${req.params.isbn}`
  });
}
return res.json({authors: getSpecificAuthor});

});


//Get all publications
/*
Route         /publications
Description   Get all publications
Access        Public
Parameter     None
Methods       GET
*/

booky.get("/publications",(req,res) => {

  const getAllPublications = PublicationModel.find();
  return res.json(getAllPublications);
});

//Add new books
/*
Route         /book/new
Description   add new book
Access        Public
Parameter     None
Methods       POST
*/

booky.post("/book/new",async (req,res) =>{
  const { newBook } = req.body;
  const addNewBook = BookModel.create(newBook)
  return res.json({books: addNewBook, message: "Book was added"});
});

//Add new authors
/*
Route         /author/new
Description   add new author
Access        Public
Parameter     None
Methods       POST
*/

booky.post("/author/new", async (req,res) =>{
  const { newAuhtor } = req.body;
const addNewAuthor = AuthorModel.create(newAuhtor);
  return res.json({authors: database.authors, message: "Author was added"});
/*  const newAuhtor = req.body;
  database.author.push(newAuhtor);
  return res.json({updatedAuthors: database.author});
  */
});

//Add new authors
/*
Route         /publication/new
Description   add new publications
Access        Public
Parameter     None
Methods       POST
*/

booky.post("/publication/new",(req,res) =>{
  const newPublication = req.body;
  database.publication.push(newPublication);
  return res.json({updatedPublications: database.publication});
});

//Update a book title
/*
Route         /book/update/:isbn
Description   update title of  the book
Access        Public
Parameter     isbn
Methods       PUT
*/
booky.put("/book/update/:isbn", async(req,res)=>{
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      title: req.body.bookTitle
    },
    {
      new: true
    }
  );

  return res.json({books: database.books});
});
//Update publication and book
/*
Route         /publication/update/book
Description   update the publication and the book
Access        Public
Parameter     isbn
Methods       PUT
*/

booky.put("/publication/update/book/:isbn",(req,res) =>{
  //Update the pub database
 database.publication.forEach((pub) =>{
   if(pub.id === req.body.pubId) {
     return pub.books.push(req.params.isbn);
   }
 });

 //Update the book database
 database.books.forEach((book) => {
   if(book.ISBN == req.params.isbn){
     book.publications = req.body.pubId;
     return;
   }
 });
 return res.json(
   {
     books : database.books,
     publications: database.publication,
     message: "Succesfully updated!"
   }
 )
});


// Delete a book
/*
Route         /book/delete/:isbn
Description   update the publication and the book
Access        Public
Parameter     isbn
Methods       DELETE
*/
booky.delete("/book/delete/:isbn", async(req,res)=>{
  const updateBookDatabase = await BookModel.findOneAndDelete({
    ISBN: req.params.isbn
  });

/*  const updateBookDatabase = database.books.filter(
    (book) => book.ISBN!== req.params.isbn
  )
  database.books = updateBookDatabase;
*/
  return res.json({books: updateBookDatabase});
});

// Delete an author from a book and vice-versa
/*
Route         /book/delete/author
Description   delete an author from book and vice-versa
Access        Public
Parameter     isbn, authorId
Methods       DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", async(req,res) =>{
 //update the book database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      $pull:{
        authors: parseInt(req.params.authorId)
      }
    },
    {
      new: true
    }
  );

  /*  database.books.forEach((book) =>{
      if(book.ISBN === req.params.isbn){
        const newAuhtorList = book.author.filter(
        (eachAuthor) => eachAuhtor !== parseInt(req.params.authorId)
      );
      book.author = newAuthorList;
      return;
      }
    });
  */  //Update author database
      database.author.forEach((eachAuthor)=>{
        if(eachAuthor.id === parseInt(req.params.authorId)){
          const newBookList = eachAuthor.books.filter(
            (book) => book !== req.params.isbn
          );
          eachAuhtor.books = newBookList;
          return;
        }
      });
      return res.json({
        book: database.books,
        author: database.author,
        message: "Author and book were deleted!!"
      })
    });


booky.listen(3000,() => console.log("Server is up and running"));
