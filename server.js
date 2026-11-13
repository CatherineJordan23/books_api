/**
 * File: server.js
 * Description: Express REST API for managing books
 * Author: Catherine Jordan Cano
 * Date: November 13. 2026
 */

const express = require('express');
const app = express();

// Middleware to read JSON data
app.use(express.json());

// Books for bookstore API
let books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        copiesAvailable: 5
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
        copiesAvailable: 3
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian Fiction",
        copiesAvailable: 7
    }
    // Add more books if you'd like!
];

// Get endpoint to retrieve all books
app.get('/api/books', (req, res) => {
    res.status(200).json(books);
});



// GET endpoint to retrieve a specific book by ID
app.get('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);

    // Find the book with the matching ID
    const book = books.find(book => book.id === id);

    // Check if the book exists
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Return the requested book
    res.status(200).json(book);
});

// POST endpoint to add a new book
app.post('/api/books', (req, res) => {
    // Get the information sent by the user
    const {title, author, genre, copiesAvailable } = req.body || {};

    // Check that title and author are provided
    if (!title || !author) {
        return res.status(400).json({
            message: 'Title and author are required'
        });
    }

    // Check that copiesAvailable is a valid number
    if ( 
        copiesAvailable !== undefined &&
        (!Number.isInteger(copiesAvailable) || copiesAvailable < 0)
    ) {
        return res.status(400).json({
            message: 'Copies available must be a non-negative whole number'
        });
    }

    // Generate a new ID that will not duplicate an existing ID
    const newID = Math.max(...books.map(book => book.id), 0) + 1;

    // Create the new book
    const newBook = {
        id: newID,
        title: title,
        author: author,
        genre: genre || 'Uncategorized',
        copiesAvailable: copiesAvailable ?? 0
    };

    // Add the new book to the array
    books.push(newBook);

    // Return the new book with status 201
    res.status(201).json(newBook);
});

// PUT endpoint to update an existing book
app.put('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);

    // Find the book with the matching ID
    const book = books.find(book => book.id === id);

    // Check if the book exists
    if (!book) {
        return res.status(404).json({ message: 'Book not found'});
    }

    // Get the update information
    const {title, author, genre, copiesAvailable } = req.body || {};

    // Check that text fields are not empty
    if (
        (title !== undefined && !title.trim()) ||
        (author !== undefined && !author.trim()) ||
        (genre !== undefined && !genre.trim())
    ) {
        return res.status(400).json({
            message: 'Book information connot be empty'
        });
    }

    // Check that copiesAvailable is a valid number
    if ( 
        copiesAvailable !== undefined &&
        (!Number.isInteger(copiesAvailable) || copiesAvailable < 0)
    ) {
        return res.status(400).json({
            message: 'Copies available must be a non-negative whole number'
        });
    }

    // Updated only the properties that were provided
    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (genre !== undefined) book.genre = genre;
    if (copiesAvailable !== undefined) {
        book.copiesAvailable = copiesAvailable;
    }

    // Return the updated book
    res.status(200).json(book);
});

// DELETE endpoint to remove a book
app.delete('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);

    // Find the position of the book in the array
    const bookIndex = books.findIndex(book => book.id === id);

    // Check if the book exists
    if (bookIndex === -1) {
        return res.status(404).json({ message: 'Book not found'});
    }

    // Remove the book from the array
    const deleteBook = books.splice(bookIndex, 1);

    // Return the deleted book
    res.status(200).json(deleteBook[0]);
});



// Start the server only when this file is run directly
if (require.main === module) {
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
}

// Export the app and books for testing
module.exports = { app, books };







