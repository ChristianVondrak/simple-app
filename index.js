const express = require('express')
const  api = express()
const data = require('./dummy')
const HOST = '0.0.0.0'
const PORT = 8888
const fs = require('fs');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

//Configuracion Override
api.use(methodOverride('_method'));

// Configura body-parser como middleware
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());


api.get('/',(req,res)=> {
    res.send('Bienvenido a mi API guapeton')
})

api.get('/directories',(req,res)=>{
    res.status(200).json(data)
})

api.get('/status',(req,res)=>{
    res.status(200).send("pong")
})


//FORMULARIO PARA LLENAR EL POST
api.get('/directoriespost', (req, res) => {
    // Leer el archivo formulario.html
    fs.readFile(__dirname + '/formulario.html', 'utf8', (err, content) => {
        if (err) {
            return res.status(500).send('Error interno del servidor');
        }
        res.send(content);
    });
});

api.post('/directories', (req, res) => {
    const nuevoObjeto = req.body;

    // Generamos un nuevo id para el objeto
    const nuevoId = Object.keys(data).length + 1;

    // Agregamos el nuevo objeto a data usando el nuevo id
    data[nuevoId] = nuevoObjeto;

    // Escribimos en dummy.js con los nuevos datos
    fs.writeFileSync('./dummy.js', `module.exports=${JSON.stringify(data, null, 4)}`);

    res.status(201).json({ mensaje: 'Objeto añadido exitosamente', objetoAñadido: nuevoObjeto });
});

api.get('/directories/:id', (req, res) => {
    const id = req.params.id;

    // Verificar si el ID existe en los datos
    if (data[id]) {
        res.status(200).json(data[id]);
    } else {
        res.status(404).json({ mensaje: 'Objeto no encontrado' });
    }
});

//ACTUALIZACION DE DATOS

api.put('/directories/:id', (req, res) => {
    const id = req.params.id;
    const nuevoObjeto = req.body;

    // Verificar si el ID existe en los datos
    if (data[id]) {
        // Actualizar el objeto con el nuevo contenido
        data[id] = nuevoObjeto;

        // Escribir en dummy.js con los datos actualizados
        fs.writeFile('./dummy.js', `module.exports=${JSON.stringify(data, null, 4)}`, 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Error interno del servidor');
            }
            res.status(200).json({ mensaje: 'Objeto actualizado exitosamente', objetoActualizado: nuevoObjeto });
        });
    } else {
        res.status(404).json({ mensaje: 'Objeto no encontrado' });
    }
});

api.get('/actualizar/:id', (req, res) => {
    const id = req.params.id;

    // Verificar si el ID existe en los datos
    if (data[id]) {
        const emails = data[id].emails.map((email, index) => `
            <label for="email${index}">Correo electrónico ${index + 1}:</label>
            <input type="text" id="email${index}" name="emails[${index}]" value="${email}"><br>
        `).join('');

        res.send(`
            <html>
                <head>
                    <title>Actualizar Objeto</title>
                </head>
                <body>
                    <h1>Actualizar Objeto</h1>

                    <form action="/directories/${id}" method="post">
                    <input type="hidden" name="_method" value="put">
                        <label for="name">Nombre:</label>
                        <input type="text" id="name" name="name" value="${data[id].name}"><br>

                        ${emails}

                        <input type="submit" value="Actualizar">
                    </form>
                </body>
            </html>
        `);
    } else {
        res.status(404).json({ mensaje: 'Objeto no encontrado' });
    }
});

api.patch('/directories/:id', (req, res) => {
    const id = req.params.id;
    const partialUpdate = req.body;

    // Verificar si el ID existe en los datos
    if (data[id]) {
        // Actualizar el objeto parcialmente
        data[id] = { ...data[id], ...partialUpdate };

        // Escribir en dummy.js con los datos actualizados
        fs.writeFile('./dummy.js', `module.exports=${JSON.stringify(data, null, 4)}`, 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Error interno del servidor');
            }
            res.status(200).json({ mensaje: 'Objeto actualizado parcialmente exitosamente', objetoActualizado: data[id] });
        });
    } else {
        res.status(404).json({ mensaje: 'Objeto no encontrado' });
    }
});

//DELETE

api.delete('/directories/:id', (req, res) => {
    const id = req.params.id;

    // Verificar si el ID existe en los datos
    if (data[id]) {
        // Eliminar el objeto
        delete data[id];

        // Escribir en dummy.js con los datos actualizados
        fs.writeFile('./dummy.js', `module.exports=${JSON.stringify(data, null, 4)}`, 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Error interno del servidor');
            }
            res.status(200).json({ mensaje: 'Objeto eliminado exitosamente' });
        });
    } else {
        res.status(404).json({ mensaje: 'Objeto no encontrado' });
    }
});




api.listen(PORT, () => console.log(`API Corriendo en ${HOST}:${PORT}`) )