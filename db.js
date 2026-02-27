const mysql = require('mysql2');
require('dotenv').config(); // 👈 ¡Esta línea es la magia! Lee el archivo .env

// 1. Configuración de la conexión usando variables de entorno
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    },
    connectTimeout: 20000 
});

// 2. Intentar conectar
connection.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err.message);
        return;
    }
    console.log('✅ ¡Conexión exitosa a la base de datos de Aiven!');
});

// 3. Crear la tabla y verificar columnas (Tu lógica actual que funciona perfecto)
const sqlCreateTable = `
    CREATE TABLE IF NOT EXISTS productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        precio DECIMAL(10, 2) NOT NULL,
        imagen TEXT,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

connection.query(sqlCreateTable, (err) => {
    if (err) {
        console.error('❌ Error al verificar la tabla:', err.message);
        return;
    }
    console.log('📊 Tabla "productos" verificada.');

    const sqlAddColumn = "ALTER TABLE productos ADD COLUMN IF NOT EXISTS imagen TEXT AFTER precio";
    connection.query(sqlAddColumn, (err) => {
        if (err) {
            connection.query("ALTER TABLE productos ADD COLUMN imagen TEXT", (err2) => {
                if (err2) {
                    console.log('ℹ️ El campo "imagen" ya estaba creado.');
                } else {
                    console.log('✨ ¡Campo "imagen" añadido exitosamente!');
                }
            });
        } else {
            console.log('✨ Campo "imagen" listo para usar.');
        }
    });
});

module.exports = connection;