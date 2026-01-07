import './style.css'
const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const InputSearch = document.querySelector('#Input');
const CartForMovies = document.querySelector('#Movie');
const FormBtn = document.querySelector('form');
const modal = document.querySelector('#movieModal');
const modalDetails = document.querySelector('#modalDetails');
const closeBtn = document.querySelector('.close-modal');
const logo = document.querySelector('#logo');

logo.addEventListener('click', () => {
  InputSearch.value = "";
  getMovies(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=ru-RU`);
});

function showMovies(movies) {
  CartForMovies.innerHTML = ""
  movies.forEach(movie => {
    const { title, poster_path, release_date, overview } = movie;
    const moviePoster = poster_path ? IMG_URL + poster_path : 'https://myrusakov.ru/images/articles/html_placeholder_01.jpg';
    const safeOverview = overview ? overview.replace(/'/g, " ") : "Описание отсутствует";
    const safeTitle = title.replace(/'/g, " ");

    CartForMovies.innerHTML += `
      <div class="movie-card" onclick="openModal('${safeTitle}', '${safeOverview}')">
          <img src="${moviePoster}" alt="${title}">
          <h3>${title}</h3>
          <p>${release_date ? release_date.split('-')[0] : 'Неизвестно'}</p>
      </div>
    `;
  });
}

function openModal(title, overview) { 
  modalDetails.innerHTML = `
    <h2>${title}</h2>
    <p style="margin-top: 20px; line-height: 1.6;">${overview}</p>
  `;  
  modal.style.display = 'flex';
}

window.openModal = openModal;

closeBtn.onclick = () => { 
  modal.style.display = 'none'; 
};

window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};

async function getMovies(url) {
  const response = await fetch(url)
  const data = await response.json()
  showMovies(data.results)
}

FormBtn.addEventListener('submit' , async (e) => {
  e.preventDefault();
  const searchTerm = InputSearch.value.trim();
  
  if (searchTerm) { 
    const searchUrl = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchTerm}&language=ru-RU`; 
    getMovies(searchUrl);
  } else {
    const trendingUrl = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=ru-RU`;
    getMovies(trendingUrl);
  }
});

getMovies(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=ru-RU`);