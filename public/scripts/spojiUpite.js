const urlSearchParamsA = new URLSearchParams(window.location.search);
let idNekretnineZaUpite = urlSearchParamsA.get("id");

let prijavaLink;
let profilLink;
let tekst;
let forma;
window.onload = function () {
  let meni = document.getElementById("meni");

  prijavaLink = meni.contentWindow.document.getElementById("prijava");
  profilLink = meni.contentWindow.document.getElementById("profil");
  forma = document.querySelector("#unosUpita");

  profilLink.classList.add("invisible");
  PoziviAjax.getKorisnik(dajKorisnika);
};

let korisnik;
function dajKorisnika(err, data) {
  if (data) {
    forma.style.display = "flex";
    profilLink.classList.add("visible");
    prijavaLink.innerText = "Odjava";
    prijavaLink.addEventListener("click", () => {
      PoziviAjax.postLogout(function (err, data) {
        if (data) {
          prijavaLink.innerText = "Prijava";
        } else {
        }
      });
    });

    korisnik = data.username;
    let submitDugme = document.getElementById("potvrdiDugme");
    let tekstUpita = null;
    submitDugme.addEventListener("click", function () {
      let tekstUpitaPolje = document.getElementById("upitPolje");
      tekstUpita = tekstUpitaPolje.value;
      console.log(tekstUpita);
      tekst = tekstUpita;
      PoziviAjax.postUpit(idNekretnineZaUpite, tekstUpita, spojiUpit);
    });
  }
}

function spojiUpit(err, data) {
  if (data) {
    let lista = document.querySelector(".lista");

    lista.innerHTML += `
    
    <li>
                                <div class="user">${korisnik}</div>
                                <div class="upit">
                                    ${tekst}
                                </div>
                            </li>
    
    `;
  }
}
