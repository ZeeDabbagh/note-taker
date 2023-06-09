const fs = require('fs');
const express = require ('express');
const path = require('path');
const port = 3001;
const app = express();
const notesDB = require('./db/db.json')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
res.sendFile(path.join(__dirname, '/public/index.html')))

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
})

app.get('/api/notes', (req, res) => fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if(err) {
        return;
    }
    res.json(JSON.parse(data))}));
// Use fs to read file, then chain (.then) with the parameter of data

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`)
    let { title, text } = req.body

    if (!title) {
        title = "Untitled"
    }
        
    let newNote;
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const parsedNote = JSON.parse(data);
                const lastID = parsedNote[parsedNote.length].id;
                const newID = lastID + 1;

                newNote = {
                            id: newID,
                            title,
                            text,
                        };
                parsedNote.push(newNote);

                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNote, null, 4),
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
    }
    
    
    );

    app.delete('/api/notes/:id', (req, res) => {
        console.info(`${req.method} request received to delete a note`)
        let { id } = req.params
        id = parseInt(id)

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).json('Error in deleting note. Could not open database file.');
            } else {
                let parsedNote = JSON.parse(data);
                parsedNote = parsedNote.filter(function( obj ) {
                    console.log({a:obj.id, b:id})
                    return obj.id !== id;
                  });
                  console.log(parsedNote)

                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNote, null, 4),
                    // unsure about the 4 what is that?
                    (writeErr) =>
                        writeErr
                        ? console.error(writeErr)
                        : console.info('Successfully updated notes')
                        );
                        res.status(201).json({status:"Success! Removed note"});
            }
        });


      
        }
        //  else {
        // }
    )


app.listen(port, () =>
console.log(`App listening at http://localhost:${port}`))