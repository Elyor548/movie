import "./style.css";
import "./movie.css";
const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const MovieSite = document.querySelector("#movieSite");
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");
const finalUrl = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ru-RU`;

function renderMovieDetails(data) {
  MovieSite.innerHTML = `
    <div class="movie-info-container">
        <img class="detail-poster" src="${IMG_URL + data.poster_path}" alt="${
    data.title
  }">
        
        <div class="detail-text">
            <h1>${data.title}</h1>
            <span class="tagline">${data.tagline || ""}</span>
            <p><strong>Рейтинг:</strong> ⭐ ${data.vote_average.toFixed(1)}</p>
            <p><strong>Дата выхода:</strong> ${data.release_date}</p>
            <p><strong>Время:</strong> ${data.runtime} мин.</p>
            
            <div class="genres">
                ${data.genres.map((g) => `<span>${g.name}</span>`).join("")}
            </div>
            
            <h3 style="margin-top:20px;">Описание:</h3>
            <p>${data.overview}</p>
        </div>
    </div>
    `;
}

async function loadMovie() {
  try {
    const res = await fetch(finalUrl);
    const data = await res.json();

    renderMovieDetails(data);

    const playerSection = document.createElement("div");
    playerSection.className = "player-section";
    playerSection.innerHTML = `
            <h2 class="section-title">Просмотр</h2>
            <div class="tabs"">
                <button id="showTrailer" class="tab-btn active">Трейлер</button>
                <button id="showMovie" class="tab-btn">Смотреть фильм</button>
            </div>
            <div id="videoContainer" class="video-wrapper"></div>
            <p class='reklama'>
    * Плеер предоставлен сторонним сервисом. Возможно наличие рекламы.
</p>
        `;
    MovieSite.appendChild(playerSection);

    const videoContainer = document.querySelector("#videoContainer");


    async function loadTrailer() {
      const videoRes = await fetch(
        `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=ru-RU`
      );
      const videoData = await videoRes.json();
      const trailer = videoData.results.find((v) => v.type === "Trailer");

      if (trailer) {
        videoContainer.innerHTML = `
                    <iframe src="https://www.youtube.com/embed/${trailer.key}" allowfullscreen style="width: 100%; height: 500px; border-radius: 15px; border: none;"></iframe>
                `;
      } else {
        videoContainer.innerHTML =
          "<p class='donthavetreler' '>Трейлер не найден</p>";
      }
    }
    function loadFullMovie(server = 1) {
      let url = "";
      if (server === 1) url = `https://vidsrc.me/embed/movie?tmdb=${movieId}`;
      if (server === 2) url = `https://vidsrc.to/embed/movie/${movieId}`;

      videoContainer.innerHTML = `
                <iframe src="${url}" allowfullscreen style="width: 100%; height: 500px; border-radius: 15px; border: none;"></iframe>
                <div style="margin-top: 10px;">
                    <button onclick="loadFullMovie(1)" class="tab-btn">Сервер 1</button>
                    <button onclick="loadFullMovie(2)" class="tab-btn">Сервер 2</button>
                </div>
            `;
    }

    let currentMovie = {
      id: data.id,
      title: data.title,
      poster_path: data.poster_path,
    };

    let history = localStorage.getItem("movieHistory");
    let answerHistory;

    if (history === null) {
      answerHistory = [currentMovie];
    } else {
      answerHistory = JSON.parse(history);
      answerHistory = answerHistory.filter(
        (item) => item.id !== currentMovie.id
      );
      answerHistory.unshift(currentMovie);
      answerHistory = answerHistory.slice(0, 7);
    }
    localStorage.setItem("movieHistory", JSON.stringify(answerHistory));

    const HitoryContainer = document.createElement("div");
    HitoryContainer.className = "history-section";
    MovieSite.appendChild(HitoryContainer);
    const filtered = answerHistory.filter((item) => item.id !== data.id);
    const historyHTML = filtered
      .map((item) => {
        return `<a href="movie.html?id=${item.id}" class="history-item">
        <img src="${IMG_URL + item.poster_path}" alt="${item.title}">
        <p>${item.title}</p>
      </a>`;
      })
      .join("");

    let content;
    if (filtered.length > 0) {
      content = `
        <div class='history-list'>${historyHTML}</div>
        <button id="clearHistory" class="clear-btn">Очистить историю</button>
    `;
    } else {
      content = `<p class="empty-history">Вы еще ничего не смотрели</p>`;
    }

    HitoryContainer.innerHTML = `<h3>Вы недавно смотрели</h3> ${content}`;
    const btnBasket = document.querySelector("#clearHistory");

    if (btnBasket) {
      btnBasket.onclick = function () {
        localStorage.removeItem("movieHistory");
        HitoryContainer.innerHTML = `
        <h3>Вы недавно смотрели</h3> 
        <p class="empty-history">Вы еще ничего не смотрели</p>
    `;

        console.log("История очищена, надпись обновлена!");
      };
    }

    document.querySelector("#showTrailer").onclick = (e) => {
      toggleTabs(e);
      loadTrailer();
    };
    document.querySelector("#showMovie").onclick = (e) => {
      toggleTabs(e);
      loadFullMovie();
    };

    loadTrailer();
  } catch (error) {
    console.error("Ошибка:", error);
    MovieSite.innerHTML = "<h2>Ошибка загрузки данных</h2>";
  }
}

function toggleTabs(e) {
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  e.target.classList.add("active");
}

if (movieId) {
  loadMovie();
} else {
  MovieSite.innerHTML = "<h2>ID фильма не найден в ссылке</h2>";
}
