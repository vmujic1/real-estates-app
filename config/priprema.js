const db = require("./db.js");

async function initialize() {
  const nekretnine = await Promise.all([
    db.Nekretnina.create({
      tip_nekretnine: "Stan",
      naziv: "Useljiv stan Sarajevo",
      kvadratura: 58,
      cijena: 232000,
      tip_grijanja: "plin",
      lokacija: "Novo Sarajevo",
      godina_izgradnje: 2019,
      datum_objave: new Date("2023-10-01"),
      opis: "Sociis natoque penatibus.",
      klikovi: 0,
      pretrage: 0,
    }),
    db.Nekretnina.create({
      tip_nekretnine: "Poslovni prostor",
      naziv: "Mali poslovni prostor",
      kvadratura: 20,
      cijena: 70000,
      tip_grijanja: "struja",
      lokacija: "Centar",
      godina_izgradnje: 2005,
      datum_objave: new Date("2023-08-20"),
      opis: "Magnis dis parturient montes.",
      klikovi: 0,
      pretrage: 0,
    }),
  ]);

  const stan = nekretnine.find((n) => n.naziv === "Useljiv stan Sarajevo");

  const korisnici = await Promise.all([
    db.Korisnik.create({
      ime: "Vedran",
      prezime: "Mujic",
      username: "vmujic1",
      password: "$2b$10$CM.8wYZiT/WF7obFwlM4EeYx42OnwduIhIB2cG94F3zMFcTy9B3ly",
    }),
  ]);

  const vedran = korisnici.find((k) => k.username === "vmujic1");

  const upit = await db.Upit.create({ tekst_upita: "Great!" });

  await upit.setNekretnina(stan);
  await upit.setKorisnik(vedran);

  return upit;
}

module.exports = initialize;
