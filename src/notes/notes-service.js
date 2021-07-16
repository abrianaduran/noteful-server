const NotesService = {
    getAllNotes(knex) {
        return knex
            .select('*')
            .from('notes');
    },
    insertNote(knex, newNote) {
        return knex
            .insert(newNote)
            .into('notes')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getNoteById(knex, id) {
        return knex
            .from('notes')
            .select('*')
            .where('id', id)
            .first();
    },
    deleteNote(knex, id) {
        return knex('notes')
            .where({ id })
            .delete()
    },
    updateNote(knex, id, newItemFields) {
        return knex('folders')
            .where({ id })
            .update(newItemFields);
    },
    insertItemIntoNotes(knex, newItem) {
        return knex
            .insert(newItem)
            .into('notes')
            .returning('*')
            .then(rows => rows[0])
    }
};
module.exports = NotesService;
