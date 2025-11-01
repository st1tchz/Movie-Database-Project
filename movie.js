const apiKey = "94cc909a";
const baseUrl = "https://www.omdbapi.com/";

const params = new URLSearchParams(window.location.search);
const movieID = params.get("id");

async function loadMovieDetails(id) {
  try {
    const res = await fetch(`${baseUrl}?apikey=${apiKey}&i=${id}&plot=full`);
    const data = await res.json();

    if (!data || data.Response !== "True") {
      const content = document.querySelector(".movie__result--content");
      if (content) content.innerHTML = `<p>Could not load movie details.</p>`;
      return;
    }

    const posterEl = document.querySelector(".movie__page--poster");
    const contentEl = document.querySelector(".movie__result--content");

    if (!posterEl || !contentEl) {
      console.warn("movie.html is missing .movie__page--poster or .movie__result--content");
      return;
    }

    const poster =
      data.Poster && data.Poster !== "N/A"
        ? data.Poster
        : "https://placehold.co/300x450/111/fff?text=No+Image";

    // poster + fallback
    posterEl.src = poster;
    posterEl.alt = `${data.Title} poster`;
    posterEl.onerror = () => {
      posterEl.onerror = null;
      posterEl.src = "https://placehold.co/300x450/111/fff?text=No+Image";
    };

    // details
    contentEl.innerHTML = `
      <h2><strong> ${data.Title || ""}</strong></h2>
      <p> ${data.Year || ""}</p>
      <p> Rated: ${data.Rated || ""}</p>
      <p> ${data.Runtime || ""}</p>
      <p> ${data.Plot || ""}</p>
      <p> Directed by: ${data.Director || ""}</p>
      <p> Writen By: ${data.Writer || ""}</p>
      
      <p> Staring: ${data.Actors || ""}</p>
      
    `;
  } catch (err) {
    console.error("Detail fetch error:", err);
    const content = document.querySelector(".movie__result--content");
    if (content) content.innerHTML = `<p>Network error loading movie.</p>`;
  }
}

if (movieID) {
  loadMovieDetails(movieID);
}
