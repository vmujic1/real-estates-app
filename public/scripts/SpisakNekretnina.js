let SpisakNekretnina = function () {
  let listaNekretina = [];
  let listaKorisnika = [];

  let init = function (listaNekretinaNew, listaKorisnikaNew) {
    listaNekretina = listaNekretinaNew;
    listaKorisnika = listaKorisnikaNew;
  };

  let filtrirajNekretnine = function (kriterij) {
    let rezultat = [];
    if (kriterij === null || kriterij === undefined) {
      return listaNekretina;
    }

    for (let nekretnina of listaNekretina) {
      if (
        nekretnina.tip_nekretnine === kriterij.tip_nekretnine ||
        !kriterij.tip_nekretnine
      ) {
        if (
          nekretnina.kvadratura >= kriterij.min_kvadratura ||
          !kriterij.min_kvadratura
        ) {
          if (
            nekretnina.kvadratura <= kriterij.max_kvadratura ||
            !kriterij.max_kvadratura
          ) {
            if (
              nekretnina.cijena >= kriterij.min_cijena ||
              !kriterij.min_cijena
            ) {
              if (
                nekretnina.cijena <= kriterij.max_cijena ||
                !kriterij.max_cijena
              ) {
                rezultat.push(nekretnina);
              }
            }
          }
        }
      }
    }
    return rezultat;
  };

  let ucitajDetaljeNekretnine = function (id) {
    for (let nekretnina of listaKorisnika) {
      if (nekretnina.id === id) return nekretnina;
    }

    return null;
  };

  return {
    init: init,
    filtrirajNekretnine: filtrirajNekretnine,
    ucitajDetaljeNekretnin: ucitajDetaljeNekretnine,
  };
};
