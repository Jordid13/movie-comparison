import { getMovies, addMovie } from "./local-storage";
import { renderMovie, renderDefaultMovies, loadGenres } from "./dom-helpers";
import { drawCharts, reDrawCharts } from "./charts";

const getMoviesFormData = (formInformation) => {
  const formData = {
    criticScore: Number(formInformation.target["critic-score"].value),
    audienceScore: Number(formInformation.target["audience-score"].value),
    domestic: Number(formInformation.target["movie-gross-sales"].value),
    genre: formInformation.target["movie-genre"].value,
    title: formInformation.target["movie-title"].value,
  };
  return formData;
};

const loadMovies = () => {
  const movies = getMovies();
  movies.forEach((movie) => {
    renderMovie(movie);
  });
};

const handleSubmit = (event) => {
  event.preventDefault();
  const movieInformation = getMoviesFormData(event);
  //Renders the movie in HTML
  renderMovie(movieInformation);
  //Adds to Local Storage
  addMovie(movieInformation);
  //Redraw Charts
  reDrawCharts();
  document.querySelector("#movie-form").reset();
};

const main = () => {
  if (!getMovies()) renderDefaultMovies();
  loadGenres();
  loadMovies();
  drawCharts();
  //Adding event listener to the movie form. Listen to submit.
  document
    .querySelector("#movie-form")
    .addEventListener("submit", handleSubmit);

  // Adding event listener to reset movies button
  document
    .querySelector("#reset-movies")
    .addEventListener("click", renderDefaultMovies);
};

main();
