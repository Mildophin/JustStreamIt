let bestMovies;
let bestHistory;
let bestSciFi;
let bestFilmNoir;
let movie;
let array = ["b", "f", "s", "h"];

document.getElementById("best-movie-button").onclick = function () {
    displayModal();
    movie = bestMovies[0];
    updateMovie();
}

for (let element of array) {
    for (let i = 0; i < 7; i++) {
        document.getElementById(element + i).onclick = function () {
        displayModal();
        if (element === "b") {
            movie = bestMovies[i];
        } else if (element === "f") {
            movie = bestFilmNoir[i];
        }  else if (element === "s") {
            movie = bestSciFi[i];
        }  else if (element === "h") {
            movie = bestHistory[i];
        }
        updateMovie();
        }
    }
}

document.getElementById("b7").onclick = function () {
    displayModal();
    movie = bestMovies[7];
    updateMovie();
}


let modal = document.getElementById("myModal");


let span = document.getElementsByClassName("close")[0];

function displayModal() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
}


async function fetching(URL, quantityDesired) {
        let body;
        let next;
        let moviesList = [];
        await listFetching(URL, 5);
        async function listFetching(URL, quantity){
            await fetch (URL)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    body = data;
                });
        next = body['next'];
        let listing = body['results'];
        for (let step = 0; step < quantity; step++) {
            let movieBody;
            await fetchingMovie(listing[step]['url'])
            async function fetchingMovie (url) {
               await fetch(url)
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        movieBody = data;
                        let movie = {
                            image: movieBody['image_url'],
                            title: movieBody['title'],
                            genres: movieBody['genres'],
                            date: movieBody['date_published'],
                            rated: movieBody['rated'],
                            score: movieBody['imdb_score'],
                            directors: movieBody['directors'],
                            actors: movieBody['actors'],
                            duration: movieBody['duration'],
                            countries: movieBody['countries'],
                            worldwide_gross_income: movieBody['worldwide_gross_income'],
                            description: movieBody['description']
                        };
                        moviesList.push(movie)
                    });
            }
        }
        if (next == null || undefined) {
        } else if (moviesList.length < quantityDesired) {
            let missing = quantityDesired - moviesList.length;
            await listFetching(next, missing);
        }

        }
        return moviesList;
}
    fetching('http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score', 8).then(r => bestMovies = r)
    fetching('http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&genre=Film-Noir', 7).then(r => bestFilmNoir = r)
    fetching('http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&genre=Sci-Fi', 7).then(r => bestSciFi = r)
    fetching('http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&genre=History', 7).then(r => bestHistory = r)

function waitForElement(){
    if(typeof bestHistory !== "undefined" && typeof bestSciFi !== "undefined" && typeof bestMovies !== "undefined" && typeof bestFilmNoir !== "undefined"){
        load();
    } else {
        setTimeout(waitForElement, 100);
    }
}

waitForElement();

function load () {
    document.getElementById("best-movie-title").innerHTML = bestMovies[0]['title'];
    document.getElementById("best-movie-resume").innerHTML = "Description:" + bestMovies[0]['description'];

    for (let element of array) {
    for (let i = 0; i < 7; i++) {
        if (element === "b") {
            document.getElementById(element + i).style.backgroundImage = "url(" + bestMovies[i]['image'] +")";
        } else if (element === "f") {
            document.getElementById(element + i).style.backgroundImage = "url(" + bestFilmNoir[i]['image'] +")";
        }  else if (element === "s") {
            document.getElementById(element + i).style.backgroundImage = "url(" + bestSciFi[i]['image'] +")";
        }  else if (element === "h") {
            document.getElementById(element + i).style.backgroundImage = "url(" + bestHistory[i]['image'] +")";
        }
        }
    }
    document.getElementById("b7").style.backgroundImage = "url(" + bestMovies[7]['image'] +")";
}


function updateMovie () {
    document.getElementById("modal-image").style.backgroundImage = "url(" + movie['image'] +")";
    document.getElementById("modal-title").innerHTML = "Title: " + movie['title'];
    document.getElementById("modal-genres").innerHTML = "Genres: " + movie['genres'];
    document.getElementById("modal-date").innerHTML = "Date published: " + movie['date'];
    document.getElementById("modal-rated").innerHTML = "Rated: " + movie['rated'];
    document.getElementById("modal-imdb").innerHTML = "Imdb Score: " + movie['score'] + " /10";
    document.getElementById("modal-directors").innerHTML = "Directors: " + movie['directors'];
    document.getElementById("modal-actors").innerHTML = "Actors: " + movie['actors'];
    document.getElementById("modal-time").innerHTML = "Duration: " + movie['duration'] + " minutes";
    document.getElementById("modal-country").innerHTML = "Countries: " + movie['countries'];
    if (movie['worldwide_gross_income'] === null) {
        document.getElementById("modal-box").innerHTML = "World wide gross income: We don't know...";
    } else {
        document.getElementById("modal-box").innerHTML = "World wide gross income: " + movie['worldwide_gross_income'] + " $";
    }
    document.getElementById("modal-resume").innerHTML = "Description: " + movie['description'];
}

//Partie Carousel

const carousel = document.querySelector("[data-target='carousel']");
const card = carousel.querySelector("[data-target='card']");
const leftButton = document.querySelector("[data-action='slideLeft']");
const rightButton = document.querySelector("[data-action='slideRight']");

const carouselWidth = carousel.offsetWidth;
const cardStyle = card.currentStyle || window.getComputedStyle(card)
const cardMarginRight = Number(cardStyle.marginRight.match(/\d+/g)[0]);

const cardCount = carousel.querySelectorAll("[data-target='card']").length;

let offset = 0;
const maxX = -((cardCount / 3) * carouselWidth +
               (cardMarginRight * (cardCount / 3)) -
               carouselWidth - cardMarginRight);

leftButton.addEventListener("click", function() {
  if (offset !== 0) {
    offset += 200 + cardMarginRight;
    carousel.style.transform = `translateX(${offset}px)`;
    }
})

rightButton.addEventListener("click", function() {
  if (offset !== maxX) {
    offset -= 200 + cardMarginRight;
    carousel.style.transform = `translateX(${offset}px)`;
  }
})

const carouselF = document.querySelector("[data-target='carouselF']");
let offsetF = 0;
const leftButtonF = document.querySelector("[data-action='slideLeftF']");
const rightButtonF = document.querySelector("[data-action='slideRightF']");


leftButtonF.addEventListener("click", function() {
  if (offsetF !== 0) {
    offsetF += 200 + cardMarginRight;
    carouselF.style.transform = `translateX(${offsetF}px)`;
    }
})

rightButtonF.addEventListener("click", function() {
  if (offsetF !== maxX) {
    offsetF -= 200 + cardMarginRight;
    carouselF.style.transform = `translateX(${offsetF}px)`;
  }
})

const carouselS = document.querySelector("[data-target='carouselS']");
let offsetS = 0;
const leftButtonS = document.querySelector("[data-action='slideLeftS']");
const rightButtonS = document.querySelector("[data-action='slideRightS']");

leftButtonS.addEventListener("click", function() {
  if (offsetS !== 0) {
    offsetS += 200 + cardMarginRight;
    carouselS.style.transform = `translateX(${offsetS}px)`;
    }
})

rightButtonS.addEventListener("click", function() {
  if (offsetS !== maxX) {
    offsetS -= 200 + cardMarginRight;
    carouselS.style.transform = `translateX(${offsetS}px)`;
  }
})

const carouselH = document.querySelector("[data-target='carouselH']");
let offsetH = 0;
const leftButtonH = document.querySelector("[data-action='slideLeftH']");
const rightButtonH = document.querySelector("[data-action='slideRightH']");

leftButtonH.addEventListener("click", function() {
  if (offsetH !== 0) {
    offsetH += 200 + cardMarginRight;
    carouselH.style.transform = `translateX(${offsetH}px)`;
    }
})

rightButtonH.addEventListener("click", function() {
  if (offsetH !== maxX) {
    offsetH -= 200 + cardMarginRight;
    carouselH.style.transform = `translateX(${offsetH}px)`;
  }
})