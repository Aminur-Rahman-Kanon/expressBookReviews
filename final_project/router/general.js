const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username && !password) return res.status(404).json({ message: 'username & password not provided' });

  const userExists = users.filter(usr => usr.username === username);

  if (userExists.length) return res.status(400).json({ message: 'user exist' });

  users.push({ username, password });
  return res.status(200).json({ message: `user created with username: ${username}` });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const sendDataWithPromise = () => new Promise((resolve, reject) => {
        try {
            const result = { message: 'success', data: books };
            resolve(result);
        } catch (error) {
            reject(error)
        }
    })

    sendDataWithPromise().then(result => {
        if (result.message === 'success'){
            return res.status(200).json({ message: 'success', books: result.data });
        }
        else {
            return res.status(403).json({ message: 'books not found' })
        }
    }).catch(err => res.status(500).json({ message: 'internal server error' }));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const sendDataWithPromise = () => new Promise((resolve, reject) => {
    try {
        const isbn = req.params.isbn;
        const book = books[isbn];

        if (book){
            resolve({ message: 'success', data: book });
        }
    } catch (error) {
        reject(error);
    }
  })

  sendDataWithPromise().then(result => {
    if (result.message === 'success'){
        return res.status(200).json({ message: 'found', book: result.data })
    }
  }).catch(err => res.status(500).json({ message: 'internal server error' }))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const sendDataWithPromise = () => new Promise((resolve, reject) => {
    try {
        const author = req.params.author;
        const book = Object.values(books).filter(book => book.author === author);
      
        if (book.length){
            resolve({ message: 'success', data: book[0] });
        }
    } catch (error) {
        reject(error);
    }
  })

  sendDataWithPromise().then(result => {
    if (result.message === 'success'){
        return res.status(200).json({ message: 'success', book: result.data });
    }
  }).catch(err => res.status(500).json({ message: 'internal server error' }))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const sendDataWithPromise = () => new Promise((resolve, reject) => {
    try {
        const title = req.params.title;
        const result = Object.values(books).filter(book => book.title === title);
        
        if (result.length){
            resolve({ message: 'success', data: result[0] });
        }
    } catch (error) {
        reject(error)
    }
  })

  sendDataWithPromise().then(result => {
    if (result.message === 'success'){
        return res.status(200).json({ message: 'success', book: result.data })
    }
  }).catch(err => res.status(500).json({ message: 'internal server error' }));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  const review = books[isbn];
  if (review){
    const result = {
        title: review.title,
        reviews: review.reviews
    }
    return res.status(200).json({ message: 'found', result })
  }
  else {
    return res.status(404).json({ message: 'not found' });
  }
});

module.exports.general = public_users;
