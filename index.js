const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const db = require("./config/db.js");

const app = express();
const bcrypt = require("bcryptjs");
const nekretnina = require("./models/nekretnina.js");

const incijalizacija = require("./config/priprema.js");

app.use(express.static(path.join(__dirname, "/public/html")));
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/scripts", express.static(path.join(__dirname, "public/scripts")));
app.use(bodyParser.json());
app.use(
  session({ secret: "tajna-rijec", resave: false, saveUninitialized: true })
); // Dodano
app.use(cors()); // Dodano cors

db.sequelize
  .sync({ force: true })
  .then(function () {
    incijalizacija().then(function () {
      console.log("Database loaded!");
    });
  })
  .catch(function (err) {
    console.error("Greška prilikom sinhronizacije baze podataka:", err);
    process.exit(1);
  });

// /login POST - zavrseno
app.post("/login", async (req, res, next) => {
  db.Korisnik.findOne({ where: { username: req.body.username } })
    .then(async function (korisnik) {
      const provjeraLozinke = await bcrypt.compare(
        req.body.password,
        korisnik.password
      );

      if (provjeraLozinke) {
        req.session.username = korisnik.username;
        res.status(200).json({ poruka: "Uspješna prijava" });
      } else {
        res.status(401).json({ greska: "Neuspješna prijava" });
      }
    })
    .catch(function (err) {
      res.status(401).json({ greska: "Neuspješna prijava" });
    });
});

// /logout - zavrseno
app.post("/logout", (req, res, next) => {
  if (!req.session.username) {
    res.status(401).json({ greska: "Neautorizovan pristup" });
  } else {
    req.session.destroy();
    res.status(200).json({ poruka: "Uspješno ste se odjavili" });
  }
});

// /korisnik GET - zavrseno
app.get("/korisnik", async (req, res) => {
  if (!req.session.username) {
    res.status(401).json({ greska: "Neautorizovan pristup" });
  } else {
    db.Korisnik.findOne({ where: { username: req.session.username } })
      .then(function (korisnik) {
        res.status(200).json(korisnik);
      })
      .catch(function (error) {
        res.status(500).json({ greska: "Internal Server Error" });
      });
  }
});

// /nekretnine GET - zavrseno
app.get("/nekretnine", async (req, res, next) => {
  db.Nekretnina.findAll().then(function (nekretnine) {
    res.status(200).json(nekretnine);
  });
});

// /korisnik PUT - zavrseno
app.put("/korisnik", async (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ greska: "Neautorizovan pristup" });
  } else {
    let hashedPassword = null;
    if (req.body.password) {
      const saltRounds = 10;
      hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
      });
    }

    const vrednostiZaAzuriranje = {};
    if (req.body.ime) vrednostiZaAzuriranje.ime = req.body.ime;
    if (req.body.prezime) vrednostiZaAzuriranje.prezime = req.body.prezime;
    if (req.body.username) vrednostiZaAzuriranje.username = req.body.username;
    if (req.body.password) vrednostiZaAzuriranje.password = hashedPassword;

    // Ažuriranje korisnika
    db.Korisnik.update(vrednostiZaAzuriranje, {
      where: { username: req.session.username },
    }).then(function (u) {
      res.status(200).json({ poruka: "Podaci su uspješno ažurirani" });
    });
  }
});

// /upit - zavrseno
app.post("/upit", async (req, res, next) => {
  if (!req.session.username) {
    return res.status(401).json({ greska: "Neautorizovan pristup" });
  } else {
    let korisnikA = null;
    db.Korisnik.findOne({ where: { username: req.session.username } }).then(
      function (korisnik) {
        korisnikA = korisnik;
      }
    );

    db.Nekretnina.findById(req.body.nekretnina_id)
      .then(function (n) {
        if (n) {
          db.Upit.create({
            tekst_upita: req.body.tekst_upita,
            NekretninaId: req.body.nekretnina_id,
            KorisnikId: korisnikA.id,
          }).then(res.status(200).json({ poruka: "Upit uspješno dodan" }));
        } else {
          res.status(400).json({
            greska: `Nekretnina sa id-em ${req.body.nekretnina_id} ne postoji`,
          });
        }
      })
      .catch(function (err) {
        res.status(400).json({
          greska: `Nekretnina sa id-em ${req.body.nekretnina_id} ne postoji`,
        });
      });
  }
});

// /marketing/nekretnine - zavrseno
app.post("/marketing/nekretnine", async (req, res, next) => {
  req.body.nizNekretnina.forEach((nekretnina) => {
    db.Nekretnina.findOne({ where: { id: nekretnina } }).then(function (u) {
      db.Nekretnina.update(
        { pretrage: u.pretrage + 1 },
        { where: { id: u.id } }
      ).then(function (end) {
        res.status(200).end();
      });
    });
  });
});

// /marketing/nekretnine/:id - zavrseno
app.post("/marketing/nekretnina/:id", async (req, res, next) => {
  const idreq = parseInt(req.params.id, 10);

  db.Nekretnina.findOne({ where: { id: idreq } }).then(function (u) {
    db.Nekretnina.update(
      { klikovi: u.klikovi + 1 },
      { where: { id: u.id } }
    ).then(function (end) {
      res.status(200).end();
    });
  });
});

function uporediNizove(niz1, niz2) {
  if (niz1.length !== niz2.length) {
    return false;
  }

  for (let i = 0; i < niz1.length; i++) {
    const obj1 = niz1[i];
    const obj2 = niz2[i];

    if (
      obj1.id !== obj2.id ||
      obj1.pretrage !== obj2.pretrage ||
      obj1.klikovi !== obj2.klikovi
    ) {
      return false;
    }
  }
  return true;
}

let tretnutna = [];

app.post("/marketing/osvjezi", async (req, res, next) => {
  const nekretnine = await db.Nekretnina.findAll();

  let odgovor = [];
  if (req.body.nizNekretnina) {
    req.session.nizNekretnina = req.body.nizNekretnina;

    req.body.nizNekretnina.forEach((n) => {
      let nova = nekretnine.find((n1) => n1.id === n);
      if (nova) {
        odgovor.push(nova);
        n;
      }
    });
    tretnutna = Array.from(odgovor);
    res.status(200).json({ nizNekretnina: odgovor });
  } else {
    if (req.session.nizNekretnina) {
      req.session.nizNekretnina.forEach((n) => {
        let nova1 = nekretnine.find((n1) => n1.id === n);
        if (nova1) odgovor.push(nova1);
      });

      let p = uporediNizove(odgovor, tretnutna);

      if (p) {
        res.status(200).json({ nizNekretnina: [] });
      } else {
        res.status(200).json({ nizNekretnina: odgovor });
      }
    } else {
      res.status(200).json({ nizNekretnina: [] });
    }
  }
});

// /nekretnina/:id - zavrseno
app.get("/nekretnina/:id", async (req, res, next) => {
  const idreq = parseInt(req.params.id, 10);

  const nekretnina = await db.Nekretnina.findOne({ where: { id: idreq } });

  if (nekretnina) {
    let odgovor = nekretnina.toJSON();

    const upitiNekretnine = await nekretnina.getUpitiNekretnine();

    const upitiJSON = await Promise.all(
      upitiNekretnine.map(async (upit) => {
        const korisnik = await db.Korisnik.findOne({
          where: { id: upit.KorisnikId },
        });

        return {
          korisnik_username: korisnik.username,
          tekst_upita: upit.tekst_upita,
        };
      })
    );

    odgovor.upiti = upitiJSON;

    res.status(200).json(odgovor);
  } else {
    res.status(400).json({ greska: `Nekretnina sa id-em ${idreq} ne postoji` });
  }
});

app.listen(3000);
