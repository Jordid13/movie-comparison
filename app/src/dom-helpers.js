import defaultMovieData from "./movie-data.json";
import { resetMoviesToDefault } from "./local-storage";
import { reDrawCharts, toUSCurrency } from "./charts";

const loadGenres = () => {
  // Grab genres element
  const genresElement = document.querySelector("#movie-genre");
  // Making array of all the unique categories
  const genres = [];
  defaultMovieData.forEach((movie) => {
    if (!genres.includes(movie["genre"])) {
      genres.push(movie["genre"]);
    }
  });
  // Making option element for each genre and adding it to the 'Select a Genre' menu
  genres.forEach((genre) => {
    const optionElement = document.createElement("option");
    optionElement.value = genre;
    optionElement.textContent = genre; // Can add nice uppercase of first letter in the future
    genresElement.append(optionElement);
  });
};

const getMoviesList = () => {
  return document.querySelector("#movies-list");
};

const appendToMoviesList = (movieCard) => {
  const movieList = getMoviesList();
  movieList.append(movieCard);
};

const prependToMoviesList = (movieCard) => {
  const movieList = getMoviesList();
  movieList.prepend(movieCard);
};

const renderMovie = (movie) => {
  // Movie Title
  const movieTitle = document.createElement("h3");
  movieTitle.textContent = movie.title;

  //Movie Critic Score
  const criticScore = document.createElement("p");
  criticScore.textContent = `Critic Score: ${movie.criticScore}`;

  //Movie audience Score
  const audienceScore = document.createElement("p");
  audienceScore.textContent = `Audience Score: ${movie.audienceScore}`;

  //Domestic Total
  const domesticTotal = document.createElement("p");
  domesticTotal.textContent = `Domestic Total: ${toUSCurrency(movie.domestic)}`;

  //Genre
  const movieGenre = document.createElement("p");
  movieGenre.textContent = `Genre: ${movie.genre}`;

  //Movie "card"
  const movieCard = document.createElement("li");

  //Appending the movie information to the card
  movieCard.append(
    movieTitle,
    criticScore,
    audienceScore,
    domesticTotal,
    movieGenre
  );

  //Appending the card with the information to the ul (movie-list)
  return movieCard;
};

const renderDefaultMovies = () => {
  // Clean
  getMoviesList().innerHTML = "";
  defaultMovieData.forEach((movie) => {
    appendToMoviesList(renderMovie(movie));
  });
  // Resets local storage to store the default movies
  resetMoviesToDefault();
  // Updates the charts to show the default movie information
  reDrawCharts();
};

export {
  renderMovie,
  renderDefaultMovies,
  loadGenres,
  prependToMoviesList,
  appendToMoviesList,
};
