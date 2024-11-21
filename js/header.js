document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");

  menuToggle.addEventListener("click", () => {
    menu.classList.toggle("show");
  });
});

setTimeout(function () {
  var preloader = document.getElementById("preloader");
  var content = document.getElementById("content");

  preloader.style.display = "none";

  content.style.display = "block";
}, 2000);
