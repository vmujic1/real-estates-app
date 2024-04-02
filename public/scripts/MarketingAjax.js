let novaLista = [];
let kontrola = false;

const MarketingAjax = (() => {
  function impl_osvjeziPretrage(divNekretnine) {
    let ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
      if (ajax.readyState == 4 && ajax.status == 200) {
        let odgovor = JSON.parse(ajax.responseText);
        odgovor.nizNekretnina.forEach((element) => {
          let laga = divNekretnine.querySelector(`#pretrage-${element.id}`);
          laga.innerText = `Pretage: ${element.pretrage}`;
        });
      } else if (ajax.readyState == 4) {
      }
    };
    ajax.open("POST", "http://localhost:3000/marketing/osvjezi", true);

    if (kontrola) {
      staraLista = Array.from(novaLista);
      ajax.setRequestHeader("Content-Type", "application/json");
      ajax.send(JSON.stringify({ nizNekretnina: novaLista }));
    } else if (!kontrola) {
      ajax.send();
    }
  }

  function impl_osvjeziKlikove(divNekretnine) {
    let ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
      if (ajax.readyState == 4 && ajax.status == 200) {
        let odgovor = JSON.parse(ajax.responseText);
        odgovor.nizNekretnina.forEach((element) => {
          let laga = divNekretnine.querySelector(`#klikovi-${element.id}`);
          laga.innerText = `Klikovi: ${element.klikovi}`;
        });
      } else if (ajax.readyState == 4) {
      }
    };
    ajax.open("POST", "http://localhost:3000/marketing/osvjezi", true);

    if (kontrola) {
      staraLista = Array.from(novaLista);
      ajax.setRequestHeader("Content-Type", "application/json");
      kontrola = false;
      ajax.send(JSON.stringify({ nizNekretnina: novaLista }));
    } else if (!kontrola) {
      ajax.send();
    }
  }

  function impl_novoFiltriranje(listaFiltriranihNekretnina) {
    novaLista = Array.from(listaFiltriranihNekretnina);
    let ajax = new XMLHttpRequest();
    ajax.open("POST", "http://localhost:3000/marketing/nekretnine", true);
    ajax.setRequestHeader("Content-Type", "application/json");
    kontrola = true;
    ajax.send(JSON.stringify({ nizNekretnina: listaFiltriranihNekretnina }));
  }

  function impl_klikNekretnina(idNekretnine) {
    let ajax = new XMLHttpRequest();
    novaLista = Array.from([idNekretnine]);
    ajax.open(
      "POST",
      `http://localhost:3000/marketing/nekretnina/${idNekretnine}`,
      true
    );
    kontrola = true;
    ajax.send();
  }

  return {
    osvjeziPretrage: impl_osvjeziPretrage,
    osvjeziKlikove: impl_osvjeziKlikove,
    novoFiltriranje: impl_novoFiltriranje,
    klikNekretnina: impl_klikNekretnina,
  };
})();
