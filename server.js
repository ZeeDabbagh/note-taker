const fs = require('fs');
const express = require ('express');
const path = require('path');
const port = process.env.PORT || 3001;
const notesDB = require('./db/db.json')
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => 
res.sendFile(path.join(__dirname, '/public/index.html')));

app.get('/notes', (req, res) =>
res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('/api/notes', (req, res) => fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if(err) {
        return;
    }
    res.json(JSON.parse(data))}));
// Use fs to read file, then chain (.then) with the parameter of data

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`)
    const newNote = {
        id: uuidv4(),
        title: req.body.title,
        text: req.body.text,
    }
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const parsedNote = JSON.parse(data);
                parsedNote.push(newNote);
                

                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNote),
                    (writeErr) =>
                        writeErr
                        ? console.error(writeErr)
                        : console.info('Successfully updated notes')
                );
            }
        });

        const response = {
            status: 'success',
            body: newNote,
          };
      
          console.log(response);
          res.status(201).json(response);
          return notesDB;

        }) 

app.delete('/api/notes/:id', (req, res) => {
        console.log(`${req.method} request received to delete a note`)
        const id = req.params.id

        fs.readFile( "./db/db.json", 'utf8', (err, data) => {
            if (err) {
                console.log(err)
                res.status(500).json(err)
            } else {
                const deletedNote = JSON.parse(data)
                const index = deletedNote.findIndex((note) => note.id === id);
                deletedNote.splice(index, 1);

                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(deletedNote, null, 4),

                    (writeErr) => writeErr ? console.error(writeErr) : console.info('Successfully updated notes')

                    
                )
                res.status(201).json({status: 'Success! Note removed'})
            }
        })
})

app.listen(port, () =>
console.log(`App listening at http://localhost:${port}`))