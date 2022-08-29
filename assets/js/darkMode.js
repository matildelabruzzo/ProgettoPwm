init();
readPref();

function init() {
    var toggleDark = document.getElementById("darkModeToggle").addEventListener("click", function () {
        if (document.body.classList.contains("bootstrap")) {
            document.body.className = "bootstrap-dark";
            document.getElementById("topNavBar").className = "navbar navbar-expand-lg navbar bg-dark fixed-top";
            document.body.classList.add('dark-mode');
        }
        else {
            document.body.className = "bootstrap";
            document.getElementById("topNavBar").className = "navbar navbar-expand-lg navbar bg-light fixed-top";
        }
        savePref();
    })
}

function readPref() {
    let pref = JSON.parse(localStorage.getItem("darkPref"));
    let date = new Date();
    if (pref !== "undefined" && pref !== null)
        if (pref.dark && (date.getTime() - pref.date) < (1000 * 60 * 60 * 24 * 15)) {
            document.body.className = "bootstrap-dark";
            document.getElementById("topNavBar").className = "navbar navbar-expand-lg navbar bg-dark fixed-top";
        }
    savePref();
}

function savePref() {
    let date = new Date();
    let pref = {};
    if (document.body.className == "bootstrap") {
        pref = {
            "dark": false, "date": date.getTime()
        };
    } else {
        pref = {
            "dark": true, "date": date.getTime()
        };
    }
    pref = JSON.stringify(pref);
    localStorage.setItem("darkPref", pref);
}