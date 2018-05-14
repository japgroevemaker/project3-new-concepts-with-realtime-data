(function() {

  var app = {
    init: function() {
      document.body.addEventListener("click", app.refresh)
      document.getElementsByClassName("verander_verdieping")[0].addEventListener("click", floor.toggle)
      vis.init()
      bak.init()
      ammoniak.init()
      this.timer()
      socket = io()
    },
    score: {
      zaadjes: 3,
      voer: 3,
      overall: 0
    },
    refresh: function() {
      document.getElementById("zaadjes").innerHTML = app.score.zaadjes
      document.getElementById("voer").innerHTML = app.score.voer
      vol = 0
      bak.refresh(vol)
    },
    timer: function() {
      document.getElementById('timer').innerHTML = 05 + ":" + 00;
      startTimer();

      function startTimer() {
        var presentTime = document.getElementById('timer').innerHTML;
        var timeArray = presentTime.split(/[:]+/);
        var m = timeArray[0];
        var s = checkSecond((timeArray[1] - 1));
        if (s == 59) {
          m = m - 1
        }
        if (document.getElementById("timer").innerHTML == "0:00") {
          console.log("times up");
          document.getElementById("timer").classList.add("none")
          document.getElementById("submitScore").classList.remove("none")
          document.getElementById("eindScore").innerHTML = app.score.overall
          app.submitScore()
        }

        document.getElementById('timer').innerHTML = m + ":" + s;
        setTimeout(startTimer, 1000);
      }

      function checkSecond(sec) {
        if (sec < 10 && sec >= 0) {
          sec = "0" + sec
        }; // add zero in front of numbers < 10
        if (sec < 0) {
          sec = "59"
        };
        return sec;
      }
    },
    submitScore: function() {
      document.getElementById("upload").addEventListener("click", function(e) {
        e.preventDefault()
        socket.emit("uploading", {
          name: document.getElementById("uploadName").value,
          score: document.getElementById("eindScore").innerHTML
        })
        app.showLeaderboard()
      })
    },
    showLeaderboard: function() {

      function readTextFile(file) {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function() {
          if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
              var leaderboardParse = rawFile.responseText.split(",");
              // Hulp van Servin Nissen
              leaderboardParse.sort((a, b) => {
                return parseInt(b.substr(b.indexOf('.') + 1, b.length)) - parseInt(a.substr(a.indexOf('.') + 1, a.length))
              })
              // Eind hulp van Servin

              console.log(leaderboardParse);

              for (var i = 0; i < leaderboardParse.length; i++) {
                if (leaderboardParse[i].length <= 2) {

                } else {
                  werkmethode = leaderboardParse[i].split(".")
                  console.log(werkmethode);
                  document.querySelector("#leaderboard ol").innerHTML += `
                  <li>
                    <div>
                      <p>${werkmethode[0]}</p>
                      <p>${werkmethode[1]}</p>
                    </div>
                  </li>
                  `
                }
              }
              document.querySelector("#leaderboard").innerHTML += `
              <button class="shareKnop">Deel op Facebook</button>
              `
            }
          }
        }
        rawFile.send(null);
      }


      readTextFile("/scoreboard.txt")


      document.getElementById("leaderboard").classList.add("scrollUp")
    }
  }

  var floor = {
    verdieping: 0,
    toggle: function() {
      document.getElementById("kas").classList.toggle("viskweek")
      // document.getElementsByClassName("gewassen")[0].classList.toggle("none")
      if (floor.verdieping == 1) {
        floor.verdieping = 0
        document.querySelector(".verander_verdieping p").innerHTML = "Naar de Vissen"
      } else {
        floor.verdieping++
          document.querySelector(".verander_verdieping p").innerHTML = "Naar de Kas"
      }
    }
  }

  var bak = {
    index: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    init: function() {
      for (var i = 0; i < document.getElementsByClassName("bak").length; i++) {
        document.querySelectorAll(".bak img")[i].classList.remove("invisible")
        document.getElementsByClassName("bak")[i].addEventListener("click", bak.zaai)
        document.getElementById("optie1").addEventListener("click", bak.keuzeMenu)
        document.getElementById("optie2").addEventListener("click", bak.keuzeMenu)
        document.getElementById("optie3").addEventListener("click", bak.keuzeMenu)
      }
      console.log("bak.init completed");
    },
    zaai: function() {
      if (this.childNodes[1].src.includes("art/large_crop.svg")) {
        click = this
        bak.harvest(click)
      } else {
        if (app.score.zaadjes >= 1) {
          app.score.zaadjes--
            id = this.id.split("bak")
          bak.index[id[1]]++
        } else {
          console.log("no seeds ma main");
        }
      }
    },
    refresh: function() {
      console.log(bak.index);
      for (var i = 0; i < this.index.length; i++) {
        if (this.index[i] == 1) {
          document.querySelectorAll(`.bak`)[i].childNodes[1].classList.add("invisible")
        } else if (this.index[i] == 2) {
          document.querySelectorAll(`.bak`)[i].childNodes[1].src = "art/medium_crop.svg"
        } else if (this.index[i] == 3) {
          document.querySelectorAll(`.bak`)[i].childNodes[1].src = "art/large_crop.svg"
          document.querySelectorAll('.bak')[i].childNodes[3].classList.remove('none')
          console.log(document.querySelectorAll('.bak')[i].childNodes[3])
        } else {
          document.querySelectorAll(`.bak`)[i].childNodes[1].classList.remove("invisible")
          document.querySelectorAll(`.bak`)[i].childNodes[1].src = "art/small_crop.svg"
          document.querySelectorAll('.bak')[i].childNodes[3].classList.add('none')
        }
        if (app.score.zaadjes == 0 && bak.index[i] == 0) {
          vol++
          if (vol == bak.index.length) {
            app.score.zaadjes = 2
            document.getElementById('timer').innerHTML = 15 + ":" + 00;
            console.log("gameover");
            document.getElementById("timer").classList.add("none")
            document.getElementById("submitScore").classList.remove("none")
            document.getElementById("eindScore").innerHTML = app.score.overall
            app.submitScore()
          }
        }
      }
    },
    harvest: function(click) {
      document.getElementsByClassName("harvest")[0].classList.remove("none")
      document.getElementsByClassName("harvest")[0].id = `h${click.id}`
    },
    keuzeMenu: function() {
      console.log(this.id);
      console.log(this.parentNode.id);
      welkBakkie = this.parentNode.id.split("hbak")
      bak.index[welkBakkie[1]] = 0
      console.log(bak.index);
      if (this.id == "optie1") {
        app.score.voer += 2
        app.score.zaadjes += 1
      } else if (this.id == "optie2") {
        app.score.voer += 1
        app.score.zaadjes += 2
      } else {
        app.score.voer += 3
      }
      app.score.overall += 3
      document.getElementsByClassName("harvest")[0].classList.add("none")
    }
  }

  var vis = {
    vis1: {
      naam: "Chandar",
      honger: 1,
      gezondheid: 0,
      grootte: 4,
    },
    vis2: {
      naam: "Gerard",
      honger: 12,
      gezondheid: 0,
      grootte: 4,
    },
    vis3: {
      naam: "Andere Momo",
      honger: 1,
      gezondheid: 0,
      grootte: 4,
    },
    init: function() {
      for (var i = 0; i < document.querySelectorAll(".vissie img").length; i++) {
        document.querySelectorAll(".vissie img")[i].addEventListener("click", vis.openMenu)
      }
      document.getElementById("sluitVisMenu").addEventListener("click", vis.closeMenu)
      document.getElementsByClassName("voerknop")[0].addEventListener("click", vis.voer)
      console.log("vis.init completed");
    },
    openMenu: function() {
      geklikteVis = `vis.${event.target.id}`
      geklikteVis = eval(geklikteVis)
      document.getElementById(event.target.id).setAttribute("style", `width: ${geklikteVis.grootte}em; transition: all 2s ease-in-out;`)
      document.getElementById("vis_naam").innerHTML = geklikteVis.naam
      document.getElementById("vis_grootte").innerHTML = geklikteVis.grootte
      document.getElementById("vis_honger").innerHTML = geklikteVis.honger
      document.getElementById("vis_gezondheid").innerHTML = geklikteVis.gezondheid
      document.getElementsByClassName("visinfo")[0].classList.remove("none")
      document.getElementsByClassName("voerknop")[0].id = `voerknop${event.target.id}`
    },
    voer: function() {
      welkeVis = document.getElementsByClassName("voerknop")[0].id
      console.log(welkeVis);
      welkeVis = welkeVis.slice(-1)
      welkeVis = `vis.vis${welkeVis}`
      welkeVis = eval(welkeVis)
      console.log(welkeVis);
      welkeVis.honger--
      welkeVis.grootte++
      console.log(welkeVis);
      app.score.voer -= 1

      huidigAmoniaGehalte = document.getElementById("ammoniaIndicator").style.height.split("%")
      huidigAmoniaGehalte[0] = parseInt(huidigAmoniaGehalte[0])
      if (huidigAmoniaGehalte[0] == 80) {
        huidigAmoniaGehalte[0] += 20
        document.getElementById("ammoniaIndicator").setAttribute("style", `height:${huidigAmoniaGehalte[0]}%; border-radius:2em`)
      } else if (huidigAmoniaGehalte[0] == 100) {
        console.log("ammoniak vol");
      } else {
        huidigAmoniaGehalte[0] += 20
        document.getElementById("ammoniaIndicator").setAttribute("style", `height:${huidigAmoniaGehalte[0]}%`)
      }
      app.score.overall++
        document.getElementsByClassName("visinfo")[0].classList.add("none")
    },
    closeMenu: function() {
      console.log("sluit dan");
      document.getElementsByClassName("visinfo")[0].classList.add("none")
    }
  }

  var ammoniak = {
    init: function() {
      document.getElementById("ammoniakmachine").addEventListener("click", ammoniak.leeg)
      document.getElementById("indicator").addEventListener("click", ammoniak.leeg)
      console.log("ammoniak.init completed");
    },
    leeg: function() {
      hoeveelheidAmmoniak = document.getElementById("ammoniaIndicator").style.height.split("%")
      hoeveelheidAmmoniak = hoeveelheidAmmoniak[0] / 20
      document.getElementById("ammoniaIndicator").setAttribute("style", "height: 0; border-radius: 0 0 2em 2em;")
      bakkenDieGevuldKunnenWorden = []
      if (hoeveelheidAmmoniak >= 1) {
        for (var i = 0; i < bak.index.length; i++) {
          if (bak.index[i] >= 1 && bak.index[i] < 3) {
            bakDieGevultWordt = `bak${i}.${bak.index[i]}`;
            bakkenDieGevuldKunnenWorden.push(bakDieGevultWordt)
          }
        }
        ammoniak.bemest(hoeveelheidAmmoniak, bakkenDieGevuldKunnenWorden)
      } else {
        console.log("wel leeg");
      }
    },
    bemest: function(hoeveelheidAmmoniak, bakkenDieGevuldKunnenWorden) {
      var bakvol = 0
      for (var i = 0; i < hoeveelheidAmmoniak; i++) {
        var random = Math.floor(Math.random() * bakkenDieGevuldKunnenWorden.length)
        console.log(random);
        if (bakkenDieGevuldKunnenWorden != 0) {
          welkeBak = parseInt(bakkenDieGevuldKunnenWorden[random].charAt(3));
          if (bak.index[welkeBak] == 3) {
            console.log("bak vol");
            bakvol++

          } else {
            console.log(`bak${welkeBak} word bemest`);
            bak.index[welkeBak]++
          }
        } else {
          document.getElementById("ammoniaIndicator").setAttribute("style", `height: ${hoeveelheidAmmoniak * 20}%; border-radius: 0 0 2em 2em;`)
        }
      }
      if (bakvol > 0) {
        document.getElementById("ammoniaIndicator").setAttribute("style", `height: ${bakvol * 20}%; border-radius: 0 0 2em 2em;`)
      }
    }
  }


  app.init()
})();
