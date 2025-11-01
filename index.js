// http://www.omdbapi.com/?apikey=[94cc909a]&

const apiKey = "94cc909a";
const baseUrl = "http://www.omdbapi.com/"

const btn = document.querySelector(".search__btn");
const input = document.querySelector(".input__wrapper input");

btn.addEventListener("click", async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;

    const resultsContainer = document.querySelector(".movie__results");
    resultsContainer.style.display = "none"

    btn.classList.add("loading");
    btn.disabled = true;

    try {
        const res = await fetch(`${baseUrl}?apikey=${apiKey}&s=${encodeURIComponent(q)}`);
        const data = await res.json();
        console.log("OMDb response:", data)

        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (data.Response === "True") {
            renderSix(data.Search);
            resultsContainer.style.display = "flex"
        }
        else {
            resultsContainer.style.display ="none"
        }
    } catch (err) {
        console.error("Fetch error", err)
        resultsContainer.style.display = "none";
    } finally {
        btn.classList.remove("loading")
        btn.disabled = false;
    }
});

const findMovieLink = document.getElementById("findMovieLink");
const searchInput = document.querySelector(".input__wrapper input");

findMovieLink.addEventListener("click", (e) => {
    e.preventDefault();
    searchInput.classList.add("flash");

    setTimeout(() => searchInput.classList.remove("flash"), 2000);
})

const homeLink =document.getElementById("homeLink");

homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    location.reload();
} )

const contactBtn = document.querySelector(".btn__contact");

if (contactBtn) {
  contactBtn.addEventListener("click", (e) => {
    e.preventDefault();
    alert("This feature hasn't been implemented yet.");
  });
}

// This makes the six movies pop up and pulls from the API

async function renderSix(movies) {
    const container = document.querySelector(".movie__results");
    const six = (movies || []).slice(0, 6);

    const detailedMovies = await Promise.all(
        six.map(async (m) => {
            const res = await fetch(`https://www.omdbapi.com/?apikey=94cc909a&i=${m.imdbID}`);
            const details = await res.json();
            return details;
        })
    );

    container.innerHTML = detailedMovies.map(m => {
        const poster = m.Poster && m.Poster !== "N/A"
            ? m.Poster
            : "https://placehold.co/300x450?text=No+Image";
        const year = m.Year !== "N/A" ? m.Year : "";
        const rated = m.Rated !== "N/A" ? m.Rated : "";
        const runtime = m.Runtime !== "N/A" ? m.Runtime : "";
        const director = m.Director !== "N/A" ? m.Director : "";

        return `
        <div class="movie__card" data-id="${m.imdbID}">
            <img src="${poster}" class="movie__card--poster" alt="${m.Title} poster" 
            onerror="this.onerror=null; this.src='https://placehold.co/300x450?text=No+Image';">
            <h3 class="movie__card--title">${m.Title}</h3>
            <p class="movie__card--year">${m.Year}</p>                                        
            <p class="movie__card--rated">${m.Rated}</p>                                        
            <p class="movie__card--runtime">${m.Runtime}</p>    
            <p class="movie__card--metascore">Metascore: <b class="red">${m.Metascore || ""}</b></p>
            <p class="more__info"> Click for more info </p>                               
        </div>
        `;
    })
    .join("");

    document.querySelectorAll(".movie__card").forEach(card => {
        card.addEventListener("click", () => {
            const id =card.dataset.id;
            window.location.href = `movie.html?id=${id}`;
        })
    })
}

// This sort by metascore kind of

async function getTopByMetascore(query) {
  const res = await fetch(`${baseUrl}?apikey=${apiKey}&s=${encodeURIComponent(query)}`);
  const data = await res.json();
  if (data.Response !== "True") return [];

  const detailed = await Promise.all(
    data.Search.map(async (m) => {
      const r = await fetch(`${baseUrl}?apikey=${apiKey}&i=${m.imdbID}`);
      const d = await r.json();
      return d;
    })
  );

  const sorted = detailed
    .filter((m) => m.Metascore && m.Metascore !== "N/A")
    .sort((a, b) => Number(b.Metascore) - Number(a.Metascore));

  return sorted.slice(0, 6);
}

