const express = require('express');
const { sql, poolPromise } = require('./db');
const cors = require('cors');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// RUTA DE PRUEBA.
app.get('/', async (req, res) => {
    //const pool = await poolPromise;
    //const result = await pool.request().query('SELECT * FROM productos')
    //const query = result.recordset;
    res.json({ message: 'Hola Mundo' });
});

//#region CRUD PRODUCTOS.

// RUTA PARA OBTENER TODOS LOS PRODUCTOS.
app.get('/productos', async (req, res) => {
    try {
        const query = `
            SELECT p.id, p.nombre, p.marca, p.id_categoria, p.id_subcategoria, p.descripcion, p.precio, c.nombre AS categoria, s.nombre AS subcategoria
            FROM productos p
            INNER JOIN categorias c ON p.id_categoria = c.id
            INNER JOIN subcategorias s ON p.id_subcategoria = s.id
            WHERE p.status = 1`;

        const pool = await poolPromise;
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// RUTA PARA OBTENER UN PRODUCTO POR ID.
app.get('/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
        SELECT id, nombre, marca, id_categoria, id_subcategoria, descripcion, precio 
        FROM productos 
        WHERE id = ${id} AND status = 1`;

        const pool = await poolPromise;
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// RUTA PARA CREAR UN PRODUCTO.
app.post('/productos', async (req, res) => {
    try {
        const { nombre, marca, id_categoria, id_subcategoria, descripcion, precio } = req.body;
        const query = `
        INSERT INTO productos (nombre, marca, id_categoria, id_subcategoria, descripcion, precio, status) 
        VALUES ('${nombre}', '${marca}', '${id_categoria}', '${id_subcategoria}', '${descripcion}', '${precio}', 1)`;

        const pool = await poolPromise;
        const result = await pool.request().query(query);

        validateResult(result);

        res.json({ success: true, message: 'Producto creado correctamente.' });
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// RUTA PARA ACTUALIZAR UN PRODUCTO.
app.put('/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, marca, id_categoria, id_subcategoria, descripcion, precio } = req.body;
        const query = `
        UPDATE productos 
        SET nombre = '${nombre}', marca = '${marca}', id_categoria = '${id_categoria}', id_subcategoria = '${id_subcategoria}', descripcion = '${descripcion}', precio = '${precio}' 
        WHERE id = ${id}`;

        const pool = await poolPromise;
        const result = await pool.request().query(query);

        validateResult(result);

        res.json({ success: true, message: 'Producto actualizado correctamente.' });
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// RUTA PARA ELIMINAR UN PRODUCTO.
app.delete('/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
        UPDATE productos 
        SET status = 0 
        WHERE id = ${id}`;

        const pool = await poolPromise;
        const result = await pool.request().query(query);

        validateResult(result);

        res.json({ success: true, message: 'Producto eliminado correctamente.' });
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

//#endregion.

//#region CRUD CATEGORIAS.

// RUTA PARA OBTENER TODAS LAS CATEGORIAS.

app.get('/categorias', async (req, res) => {
    try {
        const query = `
        SELECT id, nombre 
        FROM categorias 
        WHERE status = 1`;

        const pool = await poolPromise;
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// RUTA PARA OBTENER UNA CATEGORIA POR ID.

app.get('/categorias/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
        SELECT id, nombre 
        FROM categorias 
        WHERE id = ${id} AND status = 1`;

        const pool = await poolPromise;
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// RUTA PARA CREAR UNA CATEGORIA.

app.post('/categorias', async (req, res) => {
    try {
        const { nombre } = req.body;
        const query = `
        INSERT INTO categorias (nombre, status) 
        VALUES ('${nombre}', 1)`;

        const pool = await poolPromise;
        const result = await pool.request().query(query);

        validateResult(result);

        res.json({ success: true, message: 'Categoria creada correctamente.' });
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// RUTA PARA ACTUALIZAR UNA CATEGORIA.

app.put('/categorias/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        const query = `
        UPDATE categorias 
        SET nombre = '${nombre}' 
        WHERE id = ${id}`;

        const pool = await poolPromise;
        const result = await pool.request().query(query);

        validateResult(result);

        res.json({ success: true, message: 'Categoria actualizada correctamente.' });
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// RUTA PARA ELIMINAR UNA CATEGORIA.

app.delete('/categorias/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
        UPDATE categorias 
        SET status = 0 
        WHERE id = ${id}`;

        const pool = await poolPromise;
        const result = await pool.request().query(query);

        validateResult(result);

        res.json({ success: true, message: 'Categoria eliminada correctamente.' });
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

//#endregion.


//#region CRUD SUBCATEGORIAS.

// RUTA PARA OBTENER TODAS LAS SUBCATEGORIAS.

app.get('/subcategorias', async (req, res) => {
    try {
        const query = `
            SELECT id, nombre 
            FROM subcategorias 
            WHERE status = 1`;

        const pool = await poolPromise;
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// RUTA PARA OBTENER UNA SUBCATEGORIA POR ID.

app.get('/subcategorias/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT id, nombre 
            FROM subcategorias 
            WHERE id = ${id} AND status = 1`;

        const pool = await poolPromise;
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// RUTA PARA CREAR UNA SUBCATEGORIA.

app.post('/subcategorias', async (req, res) => {
    try {
        const { nombre } = req.body;
        const query = `
            INSERT INTO subcategorias (nombre, status) 
            VALUES ('${nombre}', 1)`;

        const pool = await poolPromise;
        const result = await pool.request().query(query);

        validateResult(result);

        res.json({ success: true, message: 'Subcategoria creada correctamente.' });
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// RUTA PARA ACTUALIZAR UNA SUBCATEGORIA.

app.put('/subcategorias/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        const query = `
            UPDATE subcategorias 
            SET nombre = '${nombre}' 
            WHERE id = ${id}`;

        const pool = await poolPromise;
        const result = await pool.request().query(query);

        validateResult(result);

        res.json({ success: true, message: 'Subcategoria actualizada correctamente.' });
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// RUTA PARA ELIMINAR UNA SUBCATEGORIA.

app.delete('/subcategorias/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            UPDATE subcategorias 
            SET status = 0 
            WHERE id = ${id}`;

        const pool = await poolPromise;
        const result = await pool.request().query(query);

        validateResult(result);

        res.json({ success: true, message: 'Subcategoria eliminada correctamente.' });
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

//#endregion.

//UTILIDADES.

const validateResult = (result) => {
    if (result.rowsAffected[0] === 0) {
        res.status(404);
        res.json({ success: false, message: 'Producto no encontrado.' });
        return false;
    }
    return true;
}

// ESCUCHAR PETICIONES.
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});