const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

// Configure MySQL Connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "library"
});

connection.connect((err) => {
    if (err) {
        console.log("Error Connection to MySQL: ", err);
    }
});

// -----------------------------------------------------------------------------------------------------------------------
// Books Table

// "/books" ==> is the endpoint

// Add a new book
app.post("/books", (req, res) => {
    const { id, name, title } = req.body; // Corrected to req.body
    const query = "INSERT INTO books (id, name, title) VALUES (?, ?, ?)";
    connection.query(query, [id, name, title], (err) => {
        if (err) {
            return res.status(500).json({
                error: "Error in Adding new Book",
                details: err.message
            });
        }
        res.status(201).json({ message: "Book Has Been Added" });
    });
});

// Get all books
app.get("/books", (req, res) => {
    const query = "SELECT * FROM books";
    connection.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: "Error in Retrieving the books",
                details: err.message
            });
        }
        res.json(result);
    });
});

// Get a book by ID
app.get("/books/:id", (req, res) => {
    const query = "SELECT * FROM books WHERE id = ?";
    connection.query(query, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: "Error in Retrieving the book by this ID",
                details: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Book by this ID isn't found"
            });
        }

        res.json(result[0]);
    });
});

// Update book by ID
app.put("/books/:id", (req, res) => {
    const { name, title } = req.body;
    const query = "UPDATE books SET name = ?, title = ? WHERE id = ?";

    connection.query(query, [name, title, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error updating the book", details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book has been updated" });
    });
});

// Delete book by ID
app.delete("/books/:id", (req, res) => {
    const query = "DELETE FROM books WHERE id = ?";

    connection.query(query, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error Deleting The Book", details: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Book Not Found" });
        }
        res.status(200).json({ message: "Book Has Been Deleted" });
    });
});

// Update translation by book ID
app.patch("/books/:id/translation", (req, res) => {
    const { language } = req.body; // Corrected type

    if (!language || typeof language !== "string") {
        return res.status(400).json({ error: "Invalid or missing language" });
    }

    const query = "UPDATE books SET title = CONCAT(title, ' - (', ?, ')') WHERE id = ?";

    connection.query(query, [language, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error updating translation", details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book translation has been updated" });
    });
});

// -----------------------------------------------------------------------------------------------------------------------
// Bookshop Table

// Get Bookshop by ID
app.get("/bookshop/:id", (req, res) => {
    const query = "SELECT * FROM bookshop WHERE id = ?";

    connection.query(query, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving bookshop", details: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.json(result[0]);
    });
});

// Get Bookshop by Name
app.get("/bookshop/name/:name", (req, res) => {
    const query = "SELECT * FROM bookshop WHERE name = ?";

    connection.query(query, [req.params.name], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving bookshop", details: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.json(results);
    });
});

// Get Bookshop by Email
app.get("/bookshop/email/:email", (req, res) => {
    const query = "SELECT * FROM bookshop WHERE email = ?";

    connection.query(query, [req.params.email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving bookshop", details: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.json(results);
    });
});

// Update Bookshop Name by ID
app.patch("/bookshop/:id/name", (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "New name is required" });
    }

    const query = "UPDATE bookshop SET name = ? WHERE id = ?";

    connection.query(query, [name, req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error updating bookshop name", details: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.status(200).json({ message: "Bookshop name updated successfully" });
    });
});

// Update Bookshop Email by ID
app.patch("/bookshop/:id/email", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "New email is required" });
    }

    const query = "UPDATE bookshop SET email = ? WHERE id = ?";

    connection.query(query, [email, req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error updating bookshop email", details: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.status(200).json({ message: "Bookshop email updated successfully" });
    });
});

// Add a New Bookshop
app.post("/bookshop", (req, res) => {
    const { name, contactNumber, email, address, city } = req.body;

    if (!name || !contactNumber || !email || !address || !city) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = "INSERT INTO bookshop (name, contactNumber, email, address, city) VALUES (?, ?, ?, ?, ?)";

    connection.query(query, [name, contactNumber, email, address, city], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error adding bookshop", details: err.message });
        }
        res.status(201).json({ message: "Bookshop added successfully", id: result.insertId });
    });
});

// Delete a Bookshop by ID
app.delete("/bookshop/:id", (req, res) => {
    const query = "DELETE FROM bookshop WHERE id = ?";

    connection.query(query, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error deleting bookshop", details: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.status(200).json({ message: "Bookshop deleted successfully" });
    });
});

// -----------------------------------------------------------------------------------------------------------------------

// Start the server
const port = 3001;
app.listen(port, () => {
    console.log(`Server has been started on http://localhost:${port}`);
});
