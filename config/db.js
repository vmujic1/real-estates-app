const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt24", "root", "password", {
  host: "mysql-db",
  dialect: "mysql",
  logging: false,
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Nekretnina = sequelize.import(__dirname + "/../models/nekretnina.js");
db.Korisnik = sequelize.import(__dirname + "/../models/korisnik.js");
db.Upit = sequelize.import(__dirname + "/../models/upit.js");

// veza 1-n vise upita može biti vezano za jednu nekretninu
db.Nekretnina.hasMany(db.Upit, { as: "upitiNekretnine" });

// veza 1-n vise upita može biti napisano od jednog korisnika
db.Korisnik.hasMany(db.Upit, { as: "upitiKorisnici" });

db.Upit.belongsTo(db.Nekretnina);
db.Upit.belongsTo(db.Korisnik);

module.exports = db;
