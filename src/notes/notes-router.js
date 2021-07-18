const path = require('path')
const express = require('express')
const xss = require('xss')
const NotesService = require('./notes-service')

const notesRouter = express.Router()
const jsonParser = express.json()

notesRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        NotesService.getAllNotes(knexInstance)
            .then(notes => {
                res.json(notes)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { id, note_name, date_modified, content } = req.body
        const newNote = { id, note_name, date_modified, content }

        for (const [key, value] of Object.entries(newNote)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                }) 
            }
        }
        newNote.folder_id = folder_id
        NotesService.insertNote(
            req.app.get('db'),
            newNote
        )
        .then(note => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${note.id}`))
                .json(note)
        })
        .catch(next)
    })

    notesRouter
        .route('/:note_id')
        .all((req, res, next) => {
            NotesService.getNoteById(
                req.app.get('db'),
                req.params.id
            )
            .then(note => {
                if (!note) {
                    return res.status(404).json({
                        error: { message: `Note doesn't exist`}
                    })
                }
                res.note = note
                next()
            })
            .catch(next)
        })
        .get((req, res, next) => {
            res.json({
                id: res.note.id,
                note_name: xss(res.note.note_name),
                date_modified: res.note.date_modified,
                content: xss(res.note.content),
            })
        })
        .delete((req, res, next) => {
            NotesService.deleteNote(
                req.app.get('db'),
                req.params.id
            )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
        })
        .patch(jsonParser, (req, res, next) => {
            const { note_name, date_modified, content } = req.body
            const noteToUpdate = { note_name, date_modified, content }

            const numberofValues = Object.values(noteToUpdate).filter(Boolean).length
            if (numberOfValues === 0) {
                return res.status(400).json({
                    error: { message: `Request body myst contain either 'note_name', 'date_modified', 'content'`}
                })
            }
            NotesService.updateNote(
                req.app.get('db'),
                req.params.id,
                noteToUpdate
            )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
        })

        module.exports = notesRouter