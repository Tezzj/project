
/*----------------------------------------------- This is done to connect postgres to express server ------------------------------------- */

const { Pool } = require("pg");   // importing Pool from pg library

const pool = new Pool();

module.exports = {
    query: (text, params) => pool.query(text, params),
}