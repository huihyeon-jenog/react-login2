const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql");
const session = require("express-session");
const Router = require("./Router");
const MySQLStore = require("express-mysql-session")(session);

app.use(express.static(path.join(__dirname, "build")));
app.use(express.json());

//Database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "myapp",
});

db.connect(function (err) {
  if (err) {
    console.log("DB error");
    throw err;
    return false;
  }
});

const sessionStore = new MySQLStore(
  {
    expiration: 1825 * 86400 * 1000,
    endConnectionOnClose: false,
  },
  db
);

app.use(
  session({
    key: "12345",
    secret: "12344",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1825 * 86400 * 1000,
      httpOnly: false,
    },
  })
);

new Router(app, db);

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.listen(3000);
