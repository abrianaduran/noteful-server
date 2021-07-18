const FoldersService = {
    getAllFolders(knex){
        return knex
            .select('*')
            .from('folders');
    },
    InsertFolder(knex, newFolder) {
        return knex
            .insert(newFolder)
            .into('folders')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getFolderById(knex, id) {
        return knex
            .from('folders')
            .select('*')
            .where('id', id)
            .first();
    },
    deleteFolder(knex, id) {
        return knex('folders')
            .where({ id })
            .delete()
    },
    updateFolder(knex, id, newItemFields) {
        return knex('notes')
            .where({ id })
            .update(newItemFields);
    },
    insertItemIntoFolders(knex, newItem) {
        return knex
            .insert(newItem)
            .into('folders')
            .returning('*')
            .then(rows => rows[0]);
    },
};
module.exports = FoldersService;
// https://github.com/abrianaduran/Noteful 
// https://github.com/abrianaduran/noteful-server