// // TODO: needs to display the txt file as a huge html string

const express = require("express");
const fs = require("fs");
const router = express.Router();

router.get("/", (req, res) => {
    const firstname = req.query.firstname;
    const lastname = req.query.lastname;
    const favoritefood = req.query.favoritefood;

    const content = `${firstname}, ${lastname}, ${favoritefood}\n`;

    fs.appendFile("usersAndFoods.txt", content, err => {
        if (err) {
            console.error(err);
            res.status(500).send("Error writing to file");
            return;
        }

        res.send(`
            <html>
                <head></head>
                <body>
                    <p>Thank you ${firstname} ${lastname}. ${favoritefood} is a delicious choice!</p>
                </body>
            </html>
        `);
    });
});

router.get("/all", (req, res) => {
    fs.readFile("usersAndFoods.txt", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading file");
            return;
        }

        let htmlString = `
            <html>
                <head>
                    <title>Previous Entries</title>
                </head>
                <body>
                    <table border="1">
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Favorite Food</th>
                        </tr>
        `;

        const entries = data.trim().split("\n");
        entries.forEach(entry => {
            const [firstname, lastname, favoritefood] = entry.split(", ");
            htmlString += `
                <tr>
                    <td>${firstname}</td>
                    <td>${lastname}</td>
                    <td>${favoritefood}</td>
                </tr>
            `;
        });

        htmlString += `
                    </table>
                </body>
            </html>
        `;

        res.send(htmlString);
    });
});

module.exports = router;
