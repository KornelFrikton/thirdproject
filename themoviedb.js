document.querySelector("form").addEventListener(
    'submit',
    event => {
      event.preventDefault();

  //Kiválasztott minőség beolvasása
  const vote_max = document.querySelector("[name=vote_average]").value;
  const vote_min = document.querySelector("[name=vote_average]").value - 1.9;

  //Műfajok beolvasása
  var genre = document.querySelectorAll("[type=checkbox]");
  var list = "";
  const and = "%2C";
    for (i=0; i<genre.length; i++) {
      if (genre[i].checked) {
        list = list + genre[i].value + and;
      }
    }

  const genre_ids = list;
  
  //Találati oldalszám generálás 1-100-ig
  const page = Math.floor((Math.random() * 100) + 1); 
  
  //Megjelenési dátum generálás 2010-től napjainkig
  function randomDate(start, end) {
    var d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }

  const date = randomDate(new Date(2010,0,1), new Date());

  //Első lekérdezés
  const firsturl = `https://api.themoviedb.org/3/discover/movie?api_key=4abed2ece349a1d43dbf1f92c2ed3bad&page=${page}&primary_release_date.lte=${date}&vote_count.gte=10&vote_average.gte=${vote_min}&vote_average.lte=${vote_max}&with_genres=${genre_ids}&with_original_language=en`;

  fetch (firsturl)
  .then( result => result.json() )
  .then( data => {
    document.querySelector(".carousel-inner").innerHTML = JSON.stringify(data);

    //Oldalszám vizsgálat
    var newpage;
    var totalpage = parseInt(data.total_pages);
      //Nincs találat kiírása
    const noresult = `
    <div class="alert alert-dark" role="alert">Sajnos nincs találat, próbáld újra más beállításokkal.</div>
    `;

    if (totalpage === 0) {
      document.querySelector(".noresult").innerHTML = noresult;
    } else if (totalpage < page) {
      newpage = Math.floor((Math.random() * totalpage) + 1);    
    } else { newpage = page; 
    }

    //Második lekérdezés megfelelő oldalszámmal
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=4abed2ece349a1d43dbf1f92c2ed3bad&page=${newpage}&primary_release_date.lte=${date}&vote_count.gte=10&vote_average.gte=${vote_min}&vote_average.lte=${vote_max}&with_genres=${genre_ids}&with_original_language=en`;
    
    fetch(url)
    .then( result => result.json() )
    .then( data => {
      document.querySelector(".carousel-inner").innerHTML = JSON.stringify(data);

      const movieList = data.results;
      const markup = movieList.map( movie => `
      <div class="carousel-item">
        <img src="//image.tmdb.org/t/p/w500${movie.poster_path}" class="d-block w-100" alt="Poster of ${movie.original_title}">
        <div class="carousel-caption">
          <h4>${movie.original_title}</h4>
          <p>Minősítés: ${movie.vote_average}</p>
        </div>
      </div>
      `).join("");

      document.querySelector(".carousel-inner").innerHTML = markup ;
        
      //Carousel aktiválása
      if (totalpage > 0) {
        var element = document.querySelector(".carousel-item");
        element.classList.add("active");
        
        //Carousel lapozás hozzáadása
        const slide = `
        <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>`;
        document.querySelector(".carousel").innerHTML += slide ;

        //Nincs találat törlése
        document.querySelector(".noresult").innerHTML = ``;
      }

    })
  
    .catch(error => {
      document.body.innerHTML = `Hiba történt: ${error}` ;
    });
  });
});