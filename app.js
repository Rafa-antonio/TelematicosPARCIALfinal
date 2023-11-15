const express = require('express');
const app = express();
const mysql = require('mysql');

// Configurar MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'myflaskapp'
});

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión a MySQL: ' + err.stack);
    return;
  }
  console.log('Conectado a MySQL con el ID: ' + connection.threadId);
});

// Obtener todos los libros
// Para probar: curl -i http://localhost:5000/books
app.get('/books', (req, res) => {
  connection.query('SELECT * FROM books', (error, results) => {
    if (error) {
      console.error('Error al obtener los libros: ' + error.stack);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    res.json({ books: results });
  });
});

// Obtener un libro por su ID
// Para probar: curl -i http://localhost:5000/books/2
app.get('/books/:book_id', (req, res) => {
  const bookId = req.params.book_id;
  connection.query('SELECT * FROM books WHERE id = ?', [bookId], (error, results) => {
    if (error) {
      console.error('Error al obtener el libro: ' + error.stack);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Libro no encontrado' });
      return;
    }
    res.json({ book: results[0] });
  });
});

// Agregar un nuevo libro
// Para probar: curl -i -H "Content-Type: application/json" -X POST -d '{"title":"El libro"}' http://localhost:5000/books
app.post('/books', (req, res) => {
  const { title, description, author } = req.body;
  if (!title) {
    res.status(400).json({ error: 'El título del libro es requerido' });
    return;
  }
  connection.query('INSERT INTO books (title, description, author) VALUES (?, ?, ?)', [title, description, author], (error, results) => {
    if (error) {
      console.error('Error al agregar el libro: ' + error.stack);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    res.status(201).json({ book: req.body });
  });
});

// Editar un libro
// Para probar: curl -i -H "Content-Type: application/json" -X PUT -d '{"author":"Jorgito"}' http://localhost:5000/books/2
app.put('/books/:book_id', (req, res) => {
  const bookId = req.params.book_id;
  connection.query('SELECT * FROM books WHERE id = ?', [bookId], (error, results) => {
    if (error) {
      console.error('Error al obtener el libro: ' + error.stack);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Libro no encontrado' });
      return;
    }
    const book = results[0];
    const { title, description, author } = req.body;
    const updatedBook = {
      title: title || book.title,
      description: description || book.description,
      author: author || book.author
    };
    connection.query('UPDATE books SET title = ?, description = ?, author = ? WHERE id = ?', [updatedBook.title, updatedBook.description, updatedBook.author, bookId], (error, results) => {
      if (error) {
        console.error('Error al actualizar el libro: ' + error.stack);
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }
      res.json({ book: updatedBook });
    });
  });
});

// Eliminar un libro
// Para probar: curl -i -H "Content-Type: application/json" -X DELETE http://localhost:5000/books/1
app.delete('/books/:book_id', (req, res) => {
  const bookId = req.params.book_id;
  connection.query('DELETE FROM books WHERE id = ?', [bookId], (error, results) => {
    if (error) {
      console.error('Error al eliminar el libro: ' + error.stack);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    res.json({ result: true });
  });
});

app.listen(5000, () => {
  console.log('Servidor en ejecución en el puerto 5000');
});
