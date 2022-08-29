//#region require
const express = require('express');
const path = require('path');
require("dotenv").config();
const { send } = require('process');
const axios = require("axios");
const fs = require("fs");
const { config } = require('dotenv');
//#endregion

//#region costanti 
const listenPort = process.env.PORT || 3000;
const app = express();
let city = [];
const apiCity = process.env.APICITY_KEY;
//#endregion

//#region impostazioni middleware
app.use(express.static(path.join(__dirname, "../")));
app.use("/css", express.static(path.join(__dirname, "../css")));
app.use("/js", express.static(path.join(__dirname, "../js")));
app.use("/images", express.static(path.join(__dirname, "../images")));

app.set("views", path.join(__dirname, "../../views"));
app.set("view engine", "ejs"); //motore ejs

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
//#endregion

//#region routing
app.get("/", (req, res) => {
    res.render("index");
});
//#endregion

//#region
const server = app.listen(listenPort, async () => {
    console.log("Applicazione in ascolto su porta " + listenPort);

});
//#endregion
