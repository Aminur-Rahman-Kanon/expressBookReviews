const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const validUser = users.filter(user => user.username === username && user.password === password);
    if (validUser.length){
        return true;
    }
    else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'fingerprint_customer', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).json({message:`User successfully logged in as ${username}`});
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const { username, review } = req.body;

  if (!isbn && !username && !review) return res.status(400).json({ message: 'isbn, username and review not provided' });

  if (books[isbn]){
    if (books[isbn].reviews[username]){
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: `review updated for ${books[isbn].title} by username ${username}`,
    review: books[isbn].reviews })
    }
    else {
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: `review added for ${books[isbn].title} by ${username}`,
    review: books[isbn].reviews })
    }
  }
});

//delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const { username } = req.body;
  
    if (!isbn && !username) return res.status(400).json({ message: 'isbn or username not provided' });
  
    const reviewExist = Object.keys(books[isbn].reviews).filter(usr => usr === username);

    if (!reviewExist.length) return res.status(400).json({ message: 'review not exist' });

    //delete user review
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: 'review deleted', review: books[isbn].reviews })
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
