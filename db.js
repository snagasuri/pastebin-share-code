const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE code_snippets (id TEXT PRIMARY KEY, code TEXT)");
});

module.exports = db;
