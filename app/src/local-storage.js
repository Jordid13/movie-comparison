//Importing the default movie data to load into Local Storage for the first time.
import defaultMovieData from "./movie-data.json";

const setLocalStorageKey = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getLocalStorageKey = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.error(error);
    return null;
  }
};

const replaceMoviesData = (newMovie) => {
  setLocalStorageKey("movies-data", newMovie);
};

const getMovies = () => {
  return getLocalStorageKey("movies-data");
};

const initMovieData = () => {
  setLocalStorageKey("movies-data", defaultMovieData);
};

// Takes in an object
const addMovie = (newMovie) => {
  // Grab the movies data object from local storage
  const movies = getMovies();
  // Update
  movies.push(newMovie);
  // Replace local storage with updated movies
  replaceMoviesData(movies);
};

const resetMoviesToDefault = () => initMovieData();

export { getMovies, initMovieData, addMovie, resetMoviesToDefault };
