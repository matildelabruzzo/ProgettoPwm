//#region require
const express = require('express');
const path = require('path');
require("dotenv").config();
const MongoClient = require('mongodb').MongoClient;
const cookie = require('cookie-parser');
const { send } = require('process');
const axios = require("axios");
const fs = require("fs");
const { config } = require('dotenv');
//#endregion

//#region costanti 
const listenPort = process.env.PORT || 3000;
const DBName = process.env.DB_NAME;
const mc = new MongoClient(process.env.DB_URL);
const expireTime = 30 * 60 * 1000;
const collectionName = process.env.COLLECTION_NAME;
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

app.use(cookie());
//#endregion

//#region routing
app.get("/", (req, res) => {
    if (req.cookies.login !== undefined) {
        mc.connect(function (err, db) {
            if (err) throw err;
            let dbo = db.db(DBName);
            let query = { user: req.cookies.login };
            dbo.collection(collectionName).findOne(query, (err, result) => {
                if (err) throw err;
                res.render("index", { autentication: true, user: result.user });
                db.close();
            });

        });
    }
    else
        res.render("index", { autentication: false });
});

app.get("/login", (req, res) => {
    let auth = req.query.auth ? true : false;

    res.render("login/login", { credenzialiErrate: auth });
});

app.get("/registrazione", (req, res) => {

    res.render("login/registrazione");
});

app.get("/verificaCredenziali", (req, res) => {
    let { userName, pw } = req.query;

    if (userName !== undefined && pw !== undefined)
        mc.connect(function (err, db) {
            if (err) throw err;
            let dbo = db.db(DBName);
            let query = { user: userName };

            dbo.collection(collectionName).findOne(query, (err, result) => {
                if (err)
                    res.redirect("/login?auth=fail");
                else {
                    if (result !== null && result.pwd == pw)
                        res.cookie("login", result.user, {
                            maxAge: expireTime,
                            httpOnly: true
                        }).redirect("/");
                    else
                        res.redirect("/login?auth=fail");
                    db.close();
                }
            });

        });
    else
        res.redirect("/");
});

app.post("/creaUtente", (req, res) => {
    let { userName, mail, pw } = req.body;

    if (mail !== undefined && pw !== undefined && userName !== undefined)
        mc.connect(function (err, db) {
            if (err) throw err;
            let dbo = db.db(DBName);
            let utente = { email: mail, user: userName, pwd: pw };
            dbo.collection(collectionName).insertOne(utente, (err, result) => {
                console.log(err);
                if (err)
                    res.json({ result: "err" });
                else
                    res.json({ result: "ok" });
                db.close();
            });

        });
    else
        res.json({ result: "err" });
});

app.get("/logout", (req, res) => {
    res.clearCookie("login").redirect("/");
});
//#endregion

//#region
const server = app.listen(listenPort, async () => {
    console.log("Applicazione in ascolto su porta " + listenPort);

});
//#endregion
