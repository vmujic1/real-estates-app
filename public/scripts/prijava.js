document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    PoziviAjax.postLogin(username, password, function (error, data) {
      if (error) {
        console.error(error.message);
      } else {
        console.log(data);
        window.location.href = "nekretnine.html";
      }
    });
  });
});
