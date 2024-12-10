import Chart from "chart.js/auto";
import { getMovies } from "./local-storage";

//Helper Functions
const toUSCurrency = (number) => {
  const US_Currency = Intl.NumberFormat("en-US").format(number);
  return `$${US_Currency}`;
};

const getCriticScore = (movieName) => {
  const movieData = getMovies();
  const object = {};
  movieData.forEach((movie) => {
    if (object[movie["title"]]) {
      object[movie["title"]] += movie["criticScore"];
    } else {
      object[movie["title"]] = movie["criticScore"];
    }
  });
  return object[movieName];
};

const numberOfMoviesPerGenre = (genre) => {
  const movieData = getMovies();
  const object = {};
  movieData.forEach((movie) => {
    if (object[movie["genre"]]) {
      object[movie["genre"]] += 1;
    } else {
      object[movie["genre"]] = 1;
    }
  });
  return object[genre];
};

const getTitleForDomesticsData = () => {
  const movieData = getMovies();
  const object = {};
  movieData.forEach((movie) => {
    if (object[movie["title"]]) {
      object[movie["title"]] += Number(movie["domestic"]);
    } else {
      object[movie["title"]] = Number(movie["domestic"]);
    }
  });
  //Sorting
  return object;
};

const getSortedTitleForDomesticData = () => {
  const movieData = getMovies();
  const object = {};
  movieData.forEach((movie) => {
    if (object[movie["title"]]) {
      object[movie["title"]] += Number(movie["domestic"]);
    } else {
      object[movie["title"]] = Number(movie["domestic"]);
    }
  });
  //Sorting
  return Object.fromEntries(
    Object.entries(object).sort(([, a], [, b]) => b - a)
  );
};

const getGenresGrossSaleData = () => {
  const movieData = getMovies();
  const object = {};
  movieData.forEach((movie) => {
    if (object[movie["genre"]]) {
      object[movie["genre"]] += Number(movie["domestic"]);
    } else {
      object[movie["genre"]] = Number(movie["domestic"]);
    }
  });
  //Sorting
  return Object.fromEntries(
    Object.entries(object).sort(([, a], [, b]) => b - a)
  );
};

const getCriticScatterPoints = () => {
  const movieData = getMovies();
  const array = [];
  movieData.forEach((movie) => {
    const object = {
      x: movie["criticScore"],
      y: movie["domestic"],
    };
    array.push(object);
  });

  return array;
};

const getAudienceScatterPoints = () => {
  const movieData = getMovies();
  const array = [];
  movieData.forEach((movie) => {
    const object = {
      x: movie["audienceScore"],
      y: movie["domestic"],
    };
    array.push(object);
  });
  return array;
};

//Charts
const domesticBoxOfficeChart = () => {
  // Domestic Box Office Bar canvas
  const canvas = document.getElementById("domestic-box-office");
  // Chart Data
  const data = {
    labels: Object.keys(getSortedTitleForDomesticData()),
    datasets: [
      {
        label: "Domestic Gross",
        data: Object.values(getSortedTitleForDomesticData()),
        borderWidth: 1,
      },
    ],
  };
  // Chart Settings
  const chartSettings = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const dollars = context.parsed.y;
            const movieName = context.label;
            const domesticTotal = `Domestic Total: ${toUSCurrency(dollars)}`;
            const criticScore = `Critic Score: ${getCriticScore(movieName)}`;
            return [domesticTotal, criticScore];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `$${value / 1000000}M`;
          },
        },
      },
    },
  };
  // Drawing the chart
  new Chart(canvas, {
    type: "bar",
    data: data,
    options: chartSettings,
  });
};

const genresTotalGrossChart = () => {
  // Domestic Box Office Bar canvas
  const canvas = document.getElementById("genres-total-gross");
  // Chart Data
  const data = {
    labels: Object.keys(getGenresGrossSaleData()),
    datasets: [
      {
        data: Object.values(getGenresGrossSaleData()),
        borderWidth: 1,
      },
    ],
  };
  // Chart Settings
  const chartSettings = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const genre = context.label;
            const domesticGross = context.parsed;
            const numberOfMovies = `Number Of Movies: ${numberOfMoviesPerGenre(
              genre
            )}`;
            const domesticGrossOfMovies = `Total Domestic Gross: ${toUSCurrency(
              domesticGross
            )}`;
            return [domesticGrossOfMovies, numberOfMovies];
          },
        },
      },
    },
  };
  // Drawing the chart
  new Chart(canvas, {
    type: "doughnut",
    data: data,
    options: chartSettings,
  });
};

const criticVsAudienceChart = () => {
  // Domestic Box Office Bar canvas
  const canvas = document.getElementById("critic-audience-score");
  // Chart Data
  const data = {
    labels: Object.keys(getTitleForDomesticsData()),
    datasets: [
      {
        label: "Audience Score",
        data: getAudienceScatterPoints(),
        borderWidth: 1,
      },
      {
        label: "Critic Score",
        data: getCriticScatterPoints(),
        borderWidth: 1,
      },
    ],
  };
  // Chart Settings
  const chartSettings = {
    interaction: {
      axis: "xy",
      mode: "nearest",
      intersect: false,
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label;
            const score = context.parsed.x;
            const domesticGross = `Domestic Gross: ${toUSCurrency(
              context.parsed.y
            )}`;
            let scoreTooltip;
            switch (label) {
              case "Audience Score":
                scoreTooltip = `Audience Score: ${score}`;
                break;
              case "Critic Score":
                scoreTooltip = `Critic Score: ${score}`;
                break;
              default:
                return null;
            }
            return [domesticGross, scoreTooltip];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `$${value / 1000000}M`;
          },
        },
      },
    },
  };
  // Drawing the chart
  new Chart(canvas, {
    type: "scatter",
    data: data,
    options: chartSettings,
  });
};

const drawCharts = () => {
  const div = document.querySelectorAll("section .chart-wrapper");
  const chartIDs = [
    "domestic-box-office",
    "genres-total-gross",
    "critic-audience-score",
  ];
  div.forEach((element, index) => {
    const canvas = document.createElement("canvas");
    canvas.id = chartIDs[index];
    element.append(canvas);
  });
  domesticBoxOfficeChart();
  genresTotalGrossChart();
  criticVsAudienceChart();
};

const reDrawCharts = () => {
  const canvas = document.querySelectorAll(".chart-wrapper canvas");
  canvas.forEach((element) => element.remove());
  drawCharts();
};

export { drawCharts, reDrawCharts, toUSCurrency };
