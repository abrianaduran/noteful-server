--do things in reverse order
ALTER TABLE notes
DROP COLUMN folder_id;

DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS folders;



