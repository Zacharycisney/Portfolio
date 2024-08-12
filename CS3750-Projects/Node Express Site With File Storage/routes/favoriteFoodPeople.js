// TODO: needs to display all users who have the same type of favorite food

const express = require("express");
const fs = require("fs");
const router = express.Router();

router.get("/", (req, res) => {
    const filteredfood = req.query.filteredfood;

    fs.readFile("usersAndFoods.txt", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading file");
            return;
        }

        let htmlString = `
            <html>
                <head>
                    <title>People with Favorite Food: ${filteredfood}</title>
                </head>
                <body>
                    <h1>People who like ${filteredfood}</h1>
                    <ul>
        `;

        const entries = data.trim().split("\n");
        entries.forEach(entry => {
            const [firstname, lastname, favoritefood] = entry.split(", ");
            if (favoritefood.toLowerCase() === filteredfood.toLowerCase()) {
                htmlString += `<li>${firstname} ${lastname}</li>`;
            }
        });

        htmlString += `
                    </ul>
                </body>
            </html>
        `;

    //displays what the user entered
        res.send(htmlString);
    });
});

module.exports = router;
