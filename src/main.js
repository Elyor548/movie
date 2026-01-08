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
const loadBtn = document.querySelector('#loadMore')


let currentPage = 1; 
let currentQuery = '';
let currentUrl = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=ru-RU`


loadBtn.addEventListener('click' , (c) => {
  currentPage++
  getMovies(currentUrl , currentPage)
})

logo.addEventListener('click', () => {
  InputSearch.value = "";
  currentPage = 1
  currentUrl = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=ru-RU`;
  getMovies(currentUrl, currentPage);
});

function showMovies(movies , page) {
  if (currentPage === 1) {
    CartForMovies.innerHTML = ""
  } 



  movies.forEach(movie => {
    const { title, poster_path, release_date, id } = movie;
    const moviePoster = poster_path ? IMG_URL + poster_path : 'https://myrusakov.ru/images/articles/html_placeholder_01.jpg';
    const movieCard = `
    <div class="movie-card" style="cursor: pointer;" onclick="window.location.href='movie.html?id=${movie.id}'">
        <img class="imgposter" src="${moviePoster}" alt="${title}">
        <h3>${title}</h3>
        <p>${release_date ? release_date.split('-')[0] : 'Неизвестно'}</p>
    </div> 
  `;
        CartForMovies.innerHTML += movieCard;
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

async function getMovies(url , page) {
  const pageNumber = page || 1;
  let finalUrl = `${url}&page=${pageNumber}`
  const response = await fetch(finalUrl)
  const data = await response.json()
  showMovies(data.results , page)
}

FormBtn.addEventListener('submit', async (e) => {
  e.preventDefault();  
  currentPage = 1;
  const searchTerm = InputSearch.value.trim();
  if (searchTerm) { 
    currentUrl = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=ru-RU&query=${searchTerm}`; 
    getMovies(currentUrl, currentPage);
  } else {
    currentUrl = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=ru-RU`;
    getMovies(currentUrl, currentPage);
  }
});

getMovies(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=ru-RU&page=${currentPage}`);