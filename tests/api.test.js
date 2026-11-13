/**
 * File: api.test.js
 * Description: Automated tests for the Book REST API
 * Author: Catherine Jordan Cano
 * Date: November 13, 2026
 */
const request = require('supertest');
const { app, books } = require('../server');

// Original books used to reset the tests
const originalBooks = [
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
];

// Reset books before every test
beforeEach(() => {
    books.splice(
        0,
        books.length,
        ...originalBooks.map(book => ({ ...book }))
    );
});

// GET: Retrieve all books
describe('GET /api/books', () => {
    test('should return all books', async () => {
        const response = await request(app).get('/api/books');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(3);
        expect(response.body[0].title).toBe('The Great Gatsby');
    });
});

// GET: Retrieve one book
describe('GET /api/books/:id', () => {
    test('should return a specific book', async () => {
        const response = await request(app).get('/api/books/1');

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('The Great Gatsby');
    });

    test('should return 404 if book does not exist', async () => {
        const response = await request(app).get('/api/books/99');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Book not found');
    });
});

// POST: Add a new book
describe('POST /api/books', () => {
    test('should create a new book', async () => {
        const newBook = {
            title: 'The Hobbit',
            author: 'J.R.R. Tolkien',
            genre: 'Fantasy',
            copiesAvailable: 4


        };

        const response = await request(app)
        .post('/api/books')
        .send(newBook);

        expect(response.status).toBe(201);
        expect(response.body.title).toBe('The Hobbit');
        expect(response.body.id).toBe(4);
        expect(books).toHaveLength(4);
    });

    test('should return 400 if title or author is missing', async () => {
        const response = await request(app)
        .post('/api/books')
        .send({
            genre: 'Fantasy',
            copiesAvailable: 4
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Title and author are required');
    });
});

// PUT: Update an existing book
describe('PUT /api/books/:id', () => {
    test('should update an existing book', async () => {
        const updatedBook = {
            title: 'The Great Gatsby Updated',
            author: 'F. Scott Fitzgerald',
            genre: 'Classic Fiction',
            copiesAvailable: 10
        };

        const response = await request(app)
        .put('/api/books/1')
        .send(updatedBook);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('The Great Gatsby Updated');
        expect(response.body.copiesAvailable).toBe(10);
    });

    test('should return 404 if book does not exist', async () => {
        const response = await request(app)
        .put('/api/books/99')
        .send({ title: 'Unknown Book' });

        expect(response.status).toBe(404);
    });

    test('should update only the provided fields', async () => {
        const response = await request(app)
        .put('/api/books/1')
        .send({ title: 'Updated Title'});

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Updated Title');
        expect(response.body.author).toBe('F. Scott Fitzgerald');
    });

    test('should allow copiesAvailable to be zero', async () => {
        const response = await request(app)
        .put('/api/books/1')
        .send({ copiesAvailable: 0});

        expect(response.status).toBe(200);
        expect(response.body.copiesAvailable).toBe(0);
    });
});

// DELETE: Remove a book
describe('DELETE /api/books/:id', () => {
    test('should delete an existing book', async () => {
        const response = await request(app).delete('/api/books/1');

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('The Great Gatsby');
        expect(books).toHaveLength(2);
    });

    test('should return 404 if book does not exist', async () => {
        const response = await request(app).delete('/api/books/99');

        expect(response.status).toBe(404);
    });

    test('should not find a book after it has been deleted', async () => {
        // Delete the book
        await request(app).delete('/api/books/1');

        // Try to retrieve the deleted book
        const response = await request(app).get('/api/books/1');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Book not found');
    });
});