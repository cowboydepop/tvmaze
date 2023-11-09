"use strict";

const MISSING_IMAGE_URL = "https://tinyurl.com/missing-tv";
const TVMAZE_API_URL = "http://api.tvmaze.com/";

const $showsList = $("#showsList");
const $episodesList = $("#episodesList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

// Function to search for TV shows and display them
async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

// Event handler for the search form submission
$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

// Function to get TV shows by search term
async function getShowsByTerm(term) {
  const response = await axios.get(`${TVMAZE_API_URL}search/shows?q=${term}`);

  return response.data.map(result => {
    const show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : MISSING_IMAGE_URL,
    };
  });
}

// Function to populate TV shows in the DOM
function populateShows(shows) {
  $showsList.empty();

  shows.forEach(show => {
    const $show = createShowElement(show);
    $showsList.append($show);
  });
}

// Function to create a single TV show element
function createShowElement(show) {
  const $show = $(`
    <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
      <div class="media">
        <img src="${show.image}" alt="${show.name}" class="w-25 me-3">
        <div class="media-body">
          <h5 class="text-primary">${show.name}</h5>
          <div><small>${show.summary}</small></div>
          <button class="btn btn-outline-light btn-sm Show-getEpisodes">
            Episodes
          </button>
        </div>
      </div>
    </div>
  `);

  return $show;
}

// Event handler for clicking on the "Episodes" button
$showsList.on("click", ".Show-getEpisodes", async function (evt) {
  const showId = $(evt.target).closest(".Show").data("show-id");
  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
});

// Function to get episodes of a TV show
async function getEpisodesOfShow(id) {
  const response = await axios.get(`${TVMAZE_API_URL}shows/${id}/episodes`);

  return response.data.map(e => ({
    id: e.id,
    name: e.name,
    season: e.season,
    number: e.number,
  }));
}

// Function to populate episodes in the DOM
function populateEpisodes(episodes) {
  $episodesList.empty();

  episodes.forEach(episode => {
    const $item = $(`
      <li>
        ${episode.name} (season ${episode.season}, episode ${episode.number})
      </li>
    `);

    $episodesList.append($item);
  });

  $episodesArea.show();
}
