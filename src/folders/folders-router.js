const path = require('path')
const express = require('express')
const xss = require('xss')
const FoldersService = require('./folders-service')

const foldersRouter = express.Router()
const jsonParser = express.json()

foldersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        FoldersService.getAllFolders(knexInstance)
            .then(articles => {
                res.json(articles)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { id, folder_name } = req.body
        const newFolder = { id, folder_name }

        for(const [key, value] of Object.entries(newFolder)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                })
            }
        }
        ArticlesService.insertFolder(
            req.app.get('db'),
            newFolder
        )
            .then(folder => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${folder.id}`))
                    .json(folder)
            })
            .catch(next)
    })
    
    foldersRouter
        .route('/:folder_id')
        .all((req, res, next) => {
            ArticlesService.getFolderById(
                req.app.get('db'),
                req.params.folder_id
            )
            .then(article => {
                if (!article) {
                    return res.status(404).json({
                        error: { message: `Folder doesn't exist`}
                    })
                }
                res.article = article
                next()
            })
            .catch(next)
        })
        .get((req, res, next) => {
            res.json({
                id: res.folders.id,
                folder_name: xxs(res.folders.folder_name),
            })
        })
        .delete((req, res, next) => {
            FoldersService.deleteFolder(
                req.app.get('db'),
                req.params.id
            )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
        })
        .patch(jsonParser, (req, res, next) => {
            const { id, folder_name } = req.body
            const folderToUpdate = { id, folder_name }

            const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length
            if (numberOfValues === 0) {
                return res.status(400).json({
                    error: {
                        message: `Request body must contain either 'id',`
                    }
                })
            }
            FoldersService.updateFolder(
                req.app.get('db'),
                req.params.id,
                folderToUpdate
            )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
        })
module.exports = foldersRouter