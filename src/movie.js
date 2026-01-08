import './style.css'
const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const MovieSite = document.querySelector('#movieSite')
const urlParams =  new URLSearchParams(window.location.search);
const movieId =  urlParams.get('id');
const finalUrl =`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ru-RU`;
async function loadMovie() {
    const res = await fetch(finalUrl);
    const data = await res.json();
    
    console.log(data); // Это мы уже видим в консоли

    // ТЕПЕРЬ ДОБАВЬ ЭТО:
    MovieSite.innerHTML = `
    <div class="movie-info-container">
        <img class="detail-poster" src="${IMG_URL + data.poster_path}" alt="${data.title}">
        
        <div class="detail-text">
            <h1>${data.title}</h1>
            <span class="tagline">${data.tagline || ''}</span>
            <p><strong>Рейтинг:</strong> ⭐ ${data.vote_average.toFixed(1)}</p>
            <p><strong>Дата выхода:</strong> ${data.release_date}</p>
            <p><strong>Время:</strong> ${data.runtime} мин.</p>
            
            <div class="genres">
                ${data.genres.map(g => `<span>${g.name}</span>`).join('')}
            </div>
            
            <h3 style="margin-top:20px;">Описание:</h3>
            <p>${data.overview}</p>
        </div>
    </div>
`;
}


console.log(movieId)





loadMovie()