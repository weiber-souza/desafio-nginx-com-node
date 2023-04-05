const express = require("express")
const { uniqueNamesGenerator, names } = require('unique-names-generator');
const mysql = require("mysql")

const app = express()

const port = 3000
const config = {
    host: "db",
    user: "root",
    password: "root",
    database: "nodedb"
}


app.get("/", (req, res) => {
    registerRandomPerson(res)
})

app.listen(port, () => {
    console.log('Running on port: ' + port)
})

const registerRandomPerson = (res) => {
    const randomName = uniqueNamesGenerator({ dictionaries: [names] });

    //Create connection to database
    const connection = mysql.createConnection(config)
    const sql = `INSERT INTO people(name) values('${randomName}')`
    connection.query(sql)
    console.log(`${randomName} was inserted into database`)

    listPeople(res, connection)
}

const listPeople = (res, connection) => {
    const sqlPeople = `SELECT id, name FROM people`
    connection.query(sqlPeople, (error, results, fields) => {
        if (error) {
            throw error
        };

        let table = '<table>';
        table += '<tr><th>People ID</th><th>Name</th></tr>';
        for (let people of results) {
            table += `
            <tr>
                <td>${people.id}</td>
                <td>${people.name}</td>
            </tr>
            `;
        }

        table += '</table>';
        res.send('<h1>Full Cycle Rocks!</h1>' + table);
    });

    connection.end()
} 
