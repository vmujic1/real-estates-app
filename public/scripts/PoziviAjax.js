const PoziviAjax = (() => {
  // fnCallback se u svim metodama poziva kada stigne
  // odgovor sa servera putem Ajax-a
  // svaki callback kao parametre ima error i data,
  // error je null ako je status 200 i data je tijelo odgovora
  // ako postoji greška, poruka se prosljeđuje u error parametru
  // callback-a, a data je tada null

  // vraća korisnika koji je trenutno prijavljen na sistem
  function impl_getKorisnik(fnCallback) {
    const ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4) {
        if (ajax.status === 200) {
          // Ako je status 200, pozovite callback s podacima
          const data = JSON.parse(ajax.responseText);
          fnCallback(null, data);
        } else {
          // Ako je status različit od 200, pozovite callback s greškom
          fnCallback({ message: "Neuspješna prijava" }, null);
        }
      }
    };

    ajax.open("GET", "http://localhost:3000/korisnik", true);

    ajax.send();
  }

  // ažurira podatke loginovanog korisnika
  function impl_putKorisnik(noviPodaci, fnCallback) {
    const ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4) {
        if (ajax.status === 200) {
          // Ako je status 200, pozovite callback s podacima
          const data = JSON.parse(ajax.responseText);
          fnCallback(null, data);
        } else {
          // Ako je status različit od 200, pozovite callback s greškom
          fnCallback({ message: "Neuspješna prijava" }, null);
        }
      }
    };

    ajax.open("PUT", "http://localhost:3000/korisnik", true);

    ajax.setRequestHeader("Content-Type", "application/json");

    // Prikupite podatke iz HTML forme
    const requestData = JSON.stringify({ noviPodaci });

    // Pošaljite podatke
    ajax.send(requestData);
  }

  // dodaje novi upit za trenutno loginovanog korisnika
  function impl_postUpit(nekretnina_id, tekst_upita, fnCallback) {
    const ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4) {
        if (ajax.status === 200) {
          // Ako je status 200, pozovite callback s podacima
          const data = JSON.parse(ajax.responseText);
          fnCallback(null, data);
        } else {
          // Ako je status različit od 200, pozovite callback s greškom
          fnCallback({ message: "Neuspješna prijava" }, null);
        }
      }
    };

    ajax.open("POST", "http://localhost:3000/upit", true);

    ajax.setRequestHeader("Content-Type", "application/json");

    // Prikupite podatke iz HTML forme
    const requestData = JSON.stringify({
      nekretnina_id: nekretnina_id,
      tekst_upita: tekst_upita,
    });

    // Pošaljite podatke
    ajax.send(requestData);
  }

  function impl_getNekretnine(fnCallback) {
    const ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4) {
        if (ajax.status === 200) {
          // Ako je status 200, pozovite callback s podacima
          const data = JSON.parse(ajax.responseText);
          fnCallback(null, data);
        } else {
          // Ako je status različit od 200, pozovite callback s greškom
          fnCallback({ message: "Neuspješna prijava" }, null);
        }
      }
    };

    ajax.open("GET", "http://localhost:3000/nekretnine", true);

    // Prikupite podatke iz HTML forme

    // Pošaljite podatke
    ajax.send();
  }

  function impl_postLogin(username, password, fnCallback) {
    const ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4) {
        if (ajax.status === 200) {
          // Ako je status 200, pozovite callback s podacima
          const data = JSON.parse(ajax.responseText);
          fnCallback(null, data);
        } else {
          // Ako je status različit od 200, pozovite callback s greškom
          fnCallback({ message: "Neuspješna prijava" }, null);
        }
      }
    };

    ajax.open("POST", "http://localhost:3000/login", true);

    ajax.setRequestHeader("Content-Type", "application/json");

    // Prikupite podatke iz HTML forme
    const requestData = JSON.stringify({ username, password });

    // Pošaljite podatke
    ajax.send(requestData);
  }

  function impl_postLogout(fnCallback) {
    const ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4) {
        if (ajax.status === 200) {
          // Ako je status 200, pozovite callback s podacima
          const data = JSON.parse(ajax.responseText);
          fnCallback(null, data);
        } else {
          // Ako je status različit od 200, pozovite callback s greškom
          fnCallback({ message: "Neuspješna odjava" }, null);
        }
      }
    };

    ajax.open("POST", "http://localhost:3000/logout", true);

    // Prikupite podatke iz HTML forme

    // Pošaljite podatke
    ajax.send();
  }

  function impl_getNekretninaById(nekretnina_id, fnCallback) {
    const ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4) {
        if (ajax.status === 200) {
          // Ako je status 200, pozovite callback s podacima
          const data = JSON.parse(ajax.responseText);
          fnCallback(null, data);
        } else {
          // Ako je status različit od 200, pozovite callback s greškom
          fnCallback({ message: "Ne može se otvoriti" }, null);
        }
      }
    };

    ajax.open("GET", `http://localhost:3000/nekretnina/${nekretnina_id}`, true);

    // Prikupite podatke iz HTML forme

    // Pošaljite podatke
    ajax.send();
  }

  return {
    postLogin: impl_postLogin,
    postLogout: impl_postLogout,
    getKorisnik: impl_getKorisnik,
    putKorisnik: impl_putKorisnik,
    postUpit: impl_postUpit,
    getNekretnine: impl_getNekretnine,
    getDetalji: impl_getNekretninaById,
  };
})();
