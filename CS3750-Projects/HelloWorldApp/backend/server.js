const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });

const app = express();

app.use(cors());
app.use(express.json());

const dbo = require("./db/conn");
const helloRoute = require("./routes/helloRoute");

const port = process.env.PORT || 4000;

app.use('/', helloRoute);

app.listen(port, () => {
    dbo.connectToServer(function(err) {
        if (err) console.error(err);
    });
    console.log(`Server is running on port ${port}`);
});