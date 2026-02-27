const db = require('./db');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors()); 
app.use(express.json()); 

// 1. Bienvenida
app.get('/', (req, res) => {
    res.send('🚀 Servidor de Briggitte con soporte de imágenes funcionando');
});

// 2. LEER (GET)
app.get('/api/productos', (req, res) => {
    const sql = 'SELECT * FROM productos';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ mensaje: 'Error al leer la DB' });
        res.json(results);
    });
});

// 3. GUARDAR (POST) - Ahora con Imagen
app.post('/api/productos', (req, res) => {
    const { nombre, precio, imagen } = req.body;
    const sql = 'INSERT INTO productos (nombre, precio, imagen) VALUES (?, ?, ?)';

    db.query(sql, [nombre, precio, imagen], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ mensaje: 'Error al guardar' });
        }
        res.status(201).json({ id: result.insertId, nombre, precio, imagen });
    });
});

// 4. ACTUALIZAR (PUT)
app.put('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio, imagen } = req.body;
    const sql = 'UPDATE productos SET nombre = ?, precio = ?, imagen = ? WHERE id = ?';

    db.query(sql, [nombre, precio, imagen, id], (err, result) => {
        if (err) return res.status(500).json({ mensaje: 'Error al actualizar' });
        res.json({ mensaje: '¡Actualizado con éxito!' });
    });
});

// 5. BORRAR (DELETE)
app.delete('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM productos WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ mensaje: 'Error al borrar' });
        res.json({ mensaje: 'Eliminado correctamente' });
    });
});

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`✨ Servidor listo en el puerto ${PORT}`);
});