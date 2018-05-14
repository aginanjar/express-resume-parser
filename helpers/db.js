const mysql = require('mysql')

//Database connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

module.exports = {
    getAll: (table) => {
        connection.connect();

        connection.query('SELECT * from '+table, (error, results, fields) => {
            if (error) console.log( error )

            console.log( results )
        });

        connection.end();
    },
    insert: (table, data) => {
        if(typeof(data)!== 'object') console.log( 'Data should be an object.' )
        let query = 'INSERT INTO ' + table + ' SET ? '
        connection.query(query, data, (error, results, fields) => {
            if(error) throw error
            console.log( 'Success inserting!' )
        })
    }

}