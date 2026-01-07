const InputSearch = document.querySelector('#Input')
const ButtonSearch = document.querySelector('#btn')
const BoxForMovies = document.querySelector('#researchMovie')
const CartForMovies = document.querySelector('#Movie')
const FormBtn = document.querySelector('form')

FormBtn.addEventListener('submit' , async (e) => {
    e.preventDefault()
    let searchTern = InputSearch.value
    const key = await fetch(`http://www.omdbapi.com/?apikey=a8c0f0f3&s=${searchTern}`)
    let answer = await key.json()
    const moviesAnswer = answer.Search
    CartForMovies.innerHTML = ""
    moviesAnswer.forEach( movie => {
        let moviePoster 
        if (movie.Poster === "N/A") {
            moviePoster = 'https://via.placeholder.com/300x450?text=No+Poster'
        } else {
            moviePoster = movie.Poster }
        CartForMovies.innerHTML += `<img src="${moviePoster}" alt="${movie.Title}"
        "onerror="this.src='https://via.placeholder.com/300x450?text=Image+Error'">
            <h3> "${movie.Title}" </h3>
            <p> "${movie.Year}"</p>`
        
        
    });
} )