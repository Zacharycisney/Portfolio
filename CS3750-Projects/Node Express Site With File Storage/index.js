
const express = require("express");
const myCustomRoutes = require("./routes/previousEntries");
const secondRoute = require("./routes/favoriteFoodPeople");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// For the two html pages
app.use("/userinput_routes", myCustomRoutes);
app.use("/favoriteFoodFilter_routes", secondRoute);

// Home route
app.get("/", (req, res) => {
    res.send("Hello, World");
});

// Start the server
app.listen(port, () => {
    console.log("Server started on port: " + port);
});
