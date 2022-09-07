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
                res.render("index", { autentication: true, user: result.user, pref: result.pref });
                db.close();
            });

        });
    }
    else
        res.render("index", { autentication: false, pref: undefined });
});

//#region login
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

app.get("/areaPersonale", (req, res) => {

    let userName = req.cookies.login;

    if (userName === undefined)
        res.redirect("/");

    mc.connect(function (err, db) {
        if (err) throw err;
        let dbo = db.db(DBName);
        let query = { user: userName };
        dbo.collection(collectionName).findOne(query, (err, result) => {
            if (err) throw err;
            res.render("login/areaPersonale", { email: result.email, user: result.user, pref: result.pref });
            db.close();
        });

    });
});

app.post("/aggiornaDati", (req, res) => {

    let utente = req.cookies.login;
    let nuoviDati;

    if (utente === undefined)
        res.redirect("/");

    if (req.body.pw !== undefined)
        nuoviDati = { pwd: req.body.pw };
    else if (req.body.mail !== undefined)
        nuoviDati = { email: req.body.mail };
    else {
        nuoviDati = { user: req.body.user };
    }

    mc.connect(function (err, db) {
        if (err) throw err;
        let dbo = db.db(DBName);
        let query = { user: utente };
        let aggiorna = { $set: nuoviDati };
        dbo.collection(collectionName).updateOne(query, aggiorna, (err, result) => {

            if (err)
                res.json({ result: "err" });
            else {
                if (req.body.user !== undefined) {
                    res.clearCookie("login")
                    res.cookie("login", req.body.user, {
                        maxAge: expireTime,
                        httpOnly: true
                    });
                }
                res.json({ result: "ok" });
            }
            db.close();
        });

    });
});

app.post("/aggiungiCit", async (req, res) => {
    let utente = req.cookies.login;
    let comune = req.body.pref.toLowerCase();
    const options = {
        method: 'GET',
        url: 'https://spott.p.rapidapi.com/places/autocomplete',
        params: { limit: '10', skip: '0', language: ' it', q: comune, type: 'CITY' },
        headers: {
            'X-RapidAPI-Key': '529ab92a76msh4a5699d05e5fcbdp18aec3jsn0182800d0d4d',
            'X-RapidAPI-Host': 'spott.p.rapidapi.com'
        }
    };


    if (utente === undefined)
        res.redirect("/");

    let result = await axios.request(options);

    let citEsistente = false;


    for (el of await result.data) {
        if (typeof el.localizedName == "string")
            if (el.localizedName.toLowerCase() == comune) {

                citEsistente = true;
                mc.connect(function (err, db) {
                    if (err) throw err;
                    let dbo = db.db(DBName);
                    let query = { user: utente };
                    let aggiorna = { $push: { pref: comune } };
                    dbo.collection(collectionName).updateOne(query, aggiorna, (err, result) => {
                        if (err)
                            res.json({ result: "err" });
                        else
                            res.json({ result: "ok" });
                        db.close();
                    });

                });
            }
    }

    if (!citEsistente)
        res.json({ result: "err" });
});

app.put("/rimuoviCit", (req, res) => {
    let utente = req.cookies.login;

    if (utente === undefined)
        res.redirect("/");

    mc.connect(function (err, db) {
        if (err) throw err;
        let dbo = db.db(DBName);
        let query = { user: utente };
        let aggiorna = { $pull: { pref: req.body.pref } };
        dbo.collection(collectionName).updateOne(query, aggiorna, (err, result) => {
            if (err)
                res.json({ result: "err" });
            else
                res.json({ result: "ok" });
            db.close();
        });

    });
});

app.get("/logout", (req, res) => {
    res.clearCookie("login").redirect("/");
});
//#endregion

app.get("/aree", async (req, res) => {

    let capitali = [];
    let result = await axios("https://restcountries.com/v3.1/region/" + req.query.nomeArea);


    for (stato of await result.data) {
        if (stato.name.common !== "Macau")
            capitali.push(stato.name.common + ": " + stato.capital[0]);
    }

    if (req.cookies.login !== undefined) {
        res.render("aree/area", { autentication: true, user: req.cookies.login, nomeArea: req.query.nomeArea, capitali: capitali });
    }
    else
        res.render("aree/area", { autentication: false, nomeArea: req.query.nomeArea, capitali: capitali });
});

//#endregion

//#region
const server = app.listen(listenPort, async () => {
    console.log("Applicazione in ascolto su porta " + listenPort);

});
//#endregion
