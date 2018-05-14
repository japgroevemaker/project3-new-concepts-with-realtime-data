var huidigePagina = 0

function paginaCheck(){
  if (huidigePagina == 0) {
    document.getElementById("prev").classList.add("none")
  } else{
    document.getElementById("prev").classList.remove("none")
  }

  if (huidigePagina == 5) {
    document.getElementById("next").innerHTML = "begin aan spel"
    document.getElementById("next").setAttribute("style", "background-color:#cbe23e")
  } else if (huidigePagina == 6) {
    document.getElementById("startGame").href = "/game"
  }else {
    document.getElementById("next").innerHTML = "volgende"
    document.getElementById("next").setAttribute("style", "background-color:#darkorange")
  }
}

document.getElementById("next").addEventListener("click", function(){
  huidigePagina++
  paginaCheck()
  console.log("volgende");
  for (var i = 0; i < document.querySelectorAll("section").length; i++) {
    document.querySelectorAll("section")[i].classList.add("none")
  }
  document.getElementById(huidigePagina).classList.remove("none")
})

document.getElementById("prev").addEventListener("click", function(){
  huidigePagina--
  paginaCheck()
  console.log("vorige");
  for (var i = 0; i < document.querySelectorAll('section').length; i++) {
    document.querySelectorAll('section')[i].classList.add("none")
  }
  document.getElementById(huidigePagina).classList.remove("none")
})
