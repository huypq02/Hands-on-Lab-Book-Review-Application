const express = require('express');
const axios = require('axios').default
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username
  const password = req.body.password

  if (username && password) {
    if (!isValid(username)) {
      users.push({
        "username": username,
        "password": password
      })
      return res.status(200).json({
        message: `User ${username} register successfully`
      })
    } else {
      return res.status(200).json({
        message: "User registered"
      })
    }
  } else {
    return res.status(404).json({
      message: "Users invalid"
    })
  }

})

public_users.get('/bookList', (req, res)=> {
  return res.send(books)
})

public_users.get('/bookList/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn
  const isbnList = Object.keys(books)
  const checkExist = isbnList.find(i => i === isbn)

  if (checkExist) {
    return res.send(JSON.stringify(books[isbn], null, 4))
  } 
  else {
    return res.status(404).json({
      message: "ISBN invalid"
    })
  }
});

public_users.get('/bookList/author/:author', function (req, res) {
  const author = req.params.author
  const isbnList = Object.keys(books)
  const checkExist = isbnList.filter(i => books[i].author === author)
  let booksByAuthor = {}

  if (checkExist.length > 0) {
    checkExist.forEach(exist => {
      booksByAuthor[exist] = books[exist]
    })
    return res.send(JSON.stringify(booksByAuthor, null, 4))
  } else {
    return res.status(404).json({
      message: "Author invalid"
    })
  }
});

public_users.get('/bookList/title/:title', function (req, res) {
  const title = req.params.title
  const isbnList = Object.keys(books)
  const checkExist = isbnList.filter(i => books[i].title === title)
  let booksByTitle = {}

  if (checkExist.length > 0) {
    checkExist.forEach(exist => {
      booksByTitle[exist] = books[exist]
    })
    return res.send(JSON.stringify(booksByTitle, null, 4))
  } else {
    return res.status(404).json({
      message: "Author invalid"
    })
  }
})

async function getBookList(req, res) {
  try {
    const response = await axios.get('http://localhost:5000/bookList');
    console.log(response.data)
    res.json(response.data)
  } catch (error) {
    console.log(error.response.data)
    return res.status(error.response.status).json({message: error.code})
  }
}

async function getBookListByISBN(req, res) {
  try{
    const response = await axios.get('http://localhost:5000/bookList/isbn/'+ req.params.isbn);
    console.log(response.data)
    return res.send(JSON.stringify(response.data, null, 4))
  } catch (error) {
    console.log(error.response.data)
    return res.status(error.response.status).json({message: error.code})
  }
}

async function getBookListByAuthor(req, res) {
  try{
    const response = await axios.get('http://localhost:5000/bookList/author/'+ req.params.author);
    console.log(response.data)
    return res.send(JSON.stringify(response.data, null, 4))
  } catch (error) {
    console.log(error.response.data)
    return res.status(error.response.status).json({message: error.code})
  }
}

async function getBookListByTitle(req, res) {
  try{
    const response = await axios.get('http://localhost:5000/bookList/title/'+ req.params.title);
    console.log(response.data)
    return res.send(JSON.stringify(response.data, null, 4))
  } catch (error) {
    console.log(error.response.data)
    return res.status(error.response.status).json({message: error.code})
  }
}

// Get the book list available in the shop
public_users.get('/', getBookList)

// Get book details based on ISBN
public_users.get('/isbn/:isbn', getBookListByISBN);

// Get book details based on author
public_users.get('/author/:author', getBookListByAuthor);

// Get all books based on title
public_users.get('/title/:title', getBookListByTitle);

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn
  const isbnList = Object.keys(books)
  const checkExist = isbnList.find(i => i === isbn)

  if (checkExist) {
    return res.send(JSON.stringify(books[isbn], null, 4))
  } else {
    return res.status(404).json({
      message: "Reviews invalid"
    })
  }
});

module.exports.general = public_users;