require('dotenv').config()
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    "username": "username1",
    "password": "password1"
  }
];

const isValid = (username) => { //returns boolean
  const checkExist = users.find(user => user.username === username)
  return !!(checkExist);
}

const authenticatedUser = (username, password) => {
 const checkExist = users.find(user => (user.username === username) && (user.password === password))
 return !!(checkExist)
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username
  const password = req.body.password

  if(authenticatedUser(username, password)){
    let token = jwt.sign({username: username}, process.env.JWT_SECRET, {expiresIn: 60*60})
    req.session.authorization = {
      token
    }
    return res.json({
      token: token
    })
  } else {
    return res.status(401).json({message: "Invalid user!!!"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  const isbnList = Object.keys(books)
  const checkExist = isbnList.find(i => i === isbn)

  if(checkExist){
    const token = req.session.authorization['token']
    const decoded = jwt.decode(token)
    const usernameInToken = decoded.username

    const reviewsInPosts = books[checkExist].reviews
    const reviewers = Object.keys(reviewsInPosts)
    const checkReviewersExist = reviewers.find(reviewer => reviewer === usernameInToken)
    
    if(checkReviewersExist){
      reviewsInPosts[checkReviewersExist] = req.body.reviews
      return res.send(JSON.stringify(books))
    } else {
      reviewsInPosts[usernameInToken] = req.body.reviews
      return res.send(JSON.stringify(books))
    }
  } else{
    return res.status(404).json({message: "Invalid review"})
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  const isbnList = Object.keys(books)
  const checkExist = isbnList.find(i => i === isbn)

  if(checkExist){
    const token = req.session.authorization['token']
    const decoded = jwt.decode(token)
    const usernameInToken = decoded.username
    const reviewsInPosts = books[checkExist].reviews
    const reviewers = Object.keys(reviewsInPosts)
    const checkReviewersExist = reviewers.filter(reviewer => reviewer === usernameInToken)
    if(checkReviewersExist.length > 0){
      delete reviewsInPosts[usernameInToken]
      return res.send(JSON.stringify(books))
    } else {
      return res.status(200).json({message: "Reviewer no exist"})
    }
  } else{
    return res.status(404).json({message: "Invalid review"})
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;