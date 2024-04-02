window.onload = function () {
  let meni = document.getElementById("meni");
  console.log(meni);

  let prijavaLink = meni.contentWindow.document.getElementById("prijava");
  let profilLink = meni.contentWindow.document.getElementById("profil");
  profilLink.classList.add("invisible");

  PoziviAjax.getKorisnik(function (err, data) {
    if (data) {
      prijavaLink.innerText = "Odjava";
      profilLink.classList.add("visible");

      prijavaLink.addEventListener("click", () => {
        PoziviAjax.postLogout(function (err, data) {
          if (data) {
            prijavaLink.innerText = "Prijava";
          } else {
          }
        });
      });
    } else {
    }
  });
};
