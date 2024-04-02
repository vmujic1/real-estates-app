function spojiNekretnine(divReferenca, instancaModula, krit) {
  // pozivanje metode za filtriranje
  let laga = instancaModula.filtrirajNekretnine(krit);
  // iscrtavanje elemenata u divReferenca element
  let klasa = "";
  if (krit.tip_nekretnine === "Kuća") {
    klasa = "kuce";
  } else if (krit.tip_nekretnine === "Stan") {
    klasa = "stanovi";
  } else if (krit.tip_nekretnine === "Poslovni prostor") klasa = "pp";
  for (let nekretnina of laga) {
    divReferenca.innerHTML += `<div class="${klasa}">
    <img
      src="https://www.gradnja.rs/wp-content/uploads/2013/09/enterijer-stana-slike.jpg"
      alt="slika-stana"
      class="slika-stan"
    />
    <div class="podaci-nekretnina">
      <div class="naziv-kv">
        <p>${nekretnina.naziv}</p>
        <p>${nekretnina.kvadratura}</p>
        <p class ="gi" style="display: none">${nekretnina.godina_izgradnje}</p>
      </div>
      <div class="stan-cijena">
        <p>${nekretnina.cijena}</p>
        <p class="l" style="display: none">${nekretnina.lokacija}</p>
      </div>
    </div>
    <div id="pretrage-${nekretnina.id}">
      
    </div>
    <div id="klikovi-${nekretnina.id}">
      
    </div>
    <div class= "dugmad">
    <input type="button" value="Detalji" class="detalji-stan" id="detalji_${nekretnina.id}"/>
    <input type="button" value="Otvori detalje" class="detalji-stan otvori_detalje" id="detalji_${nekretnina.id}" style="display:none" />
    </div>
    </div>`;
  }
}

const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp");

const listaKorisnika = [
  {
    id: 1,
    ime: "Neko",
    prezime: "Nekic",
    username: "username1",
  },
  {
    id: 2,
    ime: "Neko2",
    prezime: "Nekic2",
    username: "username2",
  },
];

let modul;

PoziviAjax.getNekretnine(function (err, data) {
  if (data) {
    let laga = [];
    data.forEach((element) => {
      laga.push(element.id);
    });

    //instanciranje modula
    modul = SpisakNekretnina();
    modul.init(data, listaKorisnika);
    MarketingAjax.novoFiltriranje(laga);

    //pozivanje funkcije
    spojiNekretnine(divStan, modul, { tip_nekretnine: "Stan" });
    spojiNekretnine(divKuca, modul, { tip_nekretnine: "Kuća" });
    spojiNekretnine(divPp, modul, { tip_nekretnine: "Poslovni prostor" });

    var detaljiDugmad = document.querySelectorAll(".detalji-stan");

    var zadnjeKliknutoDugme = null;

    detaljiDugmad.forEach(function (dugme) {
      dugme.addEventListener("click", function () {
        dugme.parentNode.style.display = "grid";
        dugme.parentNode.parentNode.querySelector(".gi").style = "block";
        dugme.parentNode.parentNode.querySelector(".l").style = "block";
        dugme.parentNode.style.gridTemplateColumns = "1fr 1fr";
        dugme.parentNode.parentNode.querySelector(
          ".otvori_detalje"
        ).style.display = "block";
        if (zadnjeKliknutoDugme) {
          zadnjeKliknutoDugme.parentNode.parentNode.style.width = "300px";
          zadnjeKliknutoDugme.parentNode.parentNode.querySelector(
            ".gi"
          ).style.display = "none";
          zadnjeKliknutoDugme.parentNode.parentNode.querySelector(
            ".l"
          ).style.display = "none";
          zadnjeKliknutoDugme.parentNode.parentNode.querySelector(
            ".otvori_detalje"
          ).style.display = "none";
          zadnjeKliknutoDugme.parentNode.parentNode.style = "";
          zadnjeKliknutoDugme.parentNode.style.display = "block";
        }

        dugme.parentNode.parentNode.style.gridColumn = "span 2";

        var novaSirina = Math.min(dugme.parentNode.clientWidth, 500);
        dugme.parentNode.style.width = novaSirina + "px";
        console.log(zadnjeKliknutoDugme);
        zadnjeKliknutoDugme = dugme;

        let niz = dugme.id.split("_");
        let id = parseInt(niz[1], 10);
        MarketingAjax.klikNekretnina(id);

        let otvaranjeDetalja =
          dugme.parentNode.querySelector(".otvori_detalje");

        console.log(otvaranjeDetalja);

        otvaranjeDetalja.addEventListener("click", function () {
          let niz = otvaranjeDetalja.id.split("_");
          let id = parseInt(niz[1], 10);
          window.location.href = `http://localhost:3000/detalji.html?id=${id}`;
        });
      });
    });
  }
});

let dugmePretraga = document.getElementById("pretrazi");

dugmePretraga.addEventListener("click", () => {
  pretraziNekretnine();
});

function pretraziNekretnine() {
  let kriterij = {};

  if (document.getElementById("minCijena").value) {
    kriterij["min_cijena"] = parseFloat(
      document.getElementById("minCijena").value
    );
  }

  if (document.getElementById("maxCijena").value) {
    kriterij["max_cijena"] = parseFloat(
      document.getElementById("maxCijena").value
    );
  }

  if (document.getElementById("minKvadratura").value) {
    kriterij["min_kvadratura"] = parseFloat(
      document.getElementById("minKvadratura").value
    );
  }

  if (document.getElementById("maxKvadratura").value) {
    kriterij["max_kvadratura"] = parseFloat(
      document.getElementById("maxKvadratura").value
    );
  }

  let kuce = document.querySelector(".kuce");
  let stanovi = document.querySelector(".stanovi");

  let pp = document.querySelector(".pp");

  divKuca.innerHTML = "";
  divStan.innerHTML = "";
  divPp.innerHTML = "";

  let kriterij_stan = { ...kriterij, tip_nekretnine: "Stan" };
  spojiNekretnine(divStan, modul, kriterij_stan);

  let kriterij_kuca = { ...kriterij, tip_nekretnine: "Kuća" };
  spojiNekretnine(divKuca, modul, kriterij_kuca);

  let kriterij_pp = { ...kriterij, tip_nekretnine: "Poslovni prostor" };
  spojiNekretnine(divPp, modul, kriterij_pp);

  var detaljiDugmad = document.querySelectorAll(".detalji-stan");

  var zadnjeKliknutoDugme = null;

  detaljiDugmad.forEach(function (dugme) {
    dugme.addEventListener("click", function () {
      if (zadnjeKliknutoDugme) {
        zadnjeKliknutoDugme.parentNode.style.gridColumn = ""; // Resetiranje CSS svojstva
        zadnjeKliknutoDugme.parentNode.style.width = "auto"; // Resetiranje širine na auto
      }

      dugme.parentNode.style.gridColumn = "span 2";

      var novaSirina = Math.min(dugme.parentNode.clientWidth, 500);
      dugme.parentNode.style.width = novaSirina + "px";

      zadnjeKliknutoDugme = dugme;

      let niz = dugme.id.split("_");
      let id = parseInt(niz[1], 10);
      MarketingAjax.klikNekretnina(id);
    });
  });

  let laga = modul.filtrirajNekretnine(kriterij);
  let nizId = [];
  laga.forEach((element) => {
    nizId.push(element.id);
  });

  MarketingAjax.novoFiltriranje(nizId);
}

const divNekretnine = document.getElementById("okvir");

var intervalId = setInterval(function () {
  MarketingAjax.osvjeziPretrage(divNekretnine);
  MarketingAjax.osvjeziKlikove(divNekretnine);
}, 500);
