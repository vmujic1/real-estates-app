function spojiDetalje(err, data) {
  if (data) {
    let okvir = document.getElementById("okvir");
    console.log(okvir);

    var dateString = data.datum_objave;
    var parsedDate = new Date(dateString);

    var dan = parsedDate.getDate().toString().padStart(2, "0");
    var mjesec = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    var godina = parsedDate.getFullYear();

    var formatiraniDatum = dan + "." + mjesec + "." + godina;

    var detalji = `
        <div id="osnovno">
            <div id="naslov-slika">
                <h3>OSNOVNO</h3>
                <img src="https://melidmotional.hr/wp-content/uploads/2023/04/V1_12-Stan5.jpg" alt="" class="slika" />
            </div>
            <div id="podaci">
                <div id="naziv">
                    <h4 id="nazivi">Naziv:</h4>
                    <p>${data.naziv}</p>
                </div>
                <div id="kvadratura">
                    <h4>Kvadratra:</h4>
                    <p>${data.kvadratura}</p>
                </div>
                <div id="cijena">
                    <h4>Cijena:</h4>
                    <p>${data.cijena} KM</p>
                </div>
            </div>
        </div>
        <div id="detalji">
            <div id="nulti">
                <h3>DETALJI</h3>
            </div>
            <div id="prvi">
                <div id="grijanje">
                    <h4>Tip grijanja:</h4>
                    <p>${data.tip_grijanja}</p>
                </div>
                <div id="godina">
                    <h4>Godina izgradnje:</h4>
                    <p>${data.godina_izgradnje}</p>
                </div>
            </div>
            <div id="drugi">
                <div id="lokacija">
                    <h4>Lokacija:</h4>
                    <p>${data.lokacija}</p>
                </div>
                <div id="datum">
                    <h4>Datum objave:</h4>
                    <p>${formatiraniDatum}</p>
                </div>
            </div>
            <div id="treci">
                <h4>Opis:</h4>
                <p>
                ${data.opis}
                </p>
            </div>
        </div>

        <h3>UPITI</h3>
        <div id="upiti">
            <ul class="lista">`;

    if (data.upiti.length !== 0) {
      data.upiti.forEach((upit) => {
        detalji += `
                            <li>
                                <div class="user">${upit.korisnik_username}</div>
                                <div class="upit">
                                    ${upit.tekst_upita}
                                </div>
                            </li>`;
      });
    } else {
      // Dodajte kod za slučaj kada nema upita
    }
    detalji += `</ul>
                      </div>`;

    okvir.innerHTML = detalji;
  }
}
const urlSearchParams = new URLSearchParams(window.location.search);
let idNekretnine = urlSearchParams.get("id");

PoziviAjax.getDetalji(idNekretnine, spojiDetalje);
