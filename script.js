// ======================================================
// --- CONFIG & DATA --- (Keep this as is)
// ======================================================
const basePath = '/flow.ph'; // IMPORTANT: For GitHub Pages, THIS IS YOUR REPOSITORY NAME
const streams = [ /* ... your existing streams array ... */ ]; // Shortened for brevity
const TMDB_API_KEY = 'db4c42c9c736e876660ea34369102156';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const TMDB_LOGO_URL = 'https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg';

// --- DOM Elements --- (Keep this section, but some might not be on every page)
const bodyElement = document.body;
const mainContainer = document.getElementById('mainContainer');
// Page specific main content divs
const homeSection = document.getElementById('homeSection');
const plusPage = document.getElementById('plusPage');
const categoriesPage = document.getElementById('categoriesPage');

const categoryPillsContainer = document.getElementById('categoryPillsContainer');
const featureSliderSection = document.getElementById('featureSliderSection');
const featureSlider = document.getElementById('featureSlider');
const topChannelsRow = document.getElementById("topChannelsRow");
const homeTrendingRow = document.getElementById("homeTrendingRow");
const tmdbNowPlayingMoviesRow = document.getElementById('tmdbNowPlayingMoviesRow');
const tmdbTopRatedMoviesRow = document.getElementById('tmdbTopRatedMoviesRow');
const tmdbAiringTodayTVRow = document.getElementById('tmdbAiringTodayTVRow');
const tmdbTopRatedTVRow = document.getElementById('tmdbTopRatedTVRow');
const categoryGroups = document.getElementById("categoryGroups");
const playerContainer = document.getElementById('playerContainer');
const playerBoxExpanded = document.getElementById('playerBoxExpanded');
const playerBarMinimized = document.getElementById('playerBarMinimized');
const shakaVideoElement = document.getElementById('shaka-player');
const shakaPlayerContainer = document.getElementById('shaka-player-container');
const playerTitleExpanded = document.getElementById('playerTitleExpanded');
const playerSubExpanded = document.getElementById('playerSubExpanded');
const playerLiveIconExpanded = document.getElementById('playerLiveIconExpanded');
const minimizedLogo = document.getElementById('minimizedLogo');
const minimizedTitle = document.getElementById('minimizedTitle');
const searchModal = document.getElementById("searchModal");
const searchInput = document.getElementById("searchInput");
const searchResultsModal = document.getElementById("searchResultsModal");
const searchLoadingIndicator = searchResultsModal.querySelector('.loading-text');
const logoLink = document.querySelector('a.logo'); // This will be an <a> tag now
const mobileSearchBtn = document.getElementById("searchBtn");
const mobileProfileBtn = document.getElementById("profileBtn");
const desktopSearchBtn = document.getElementById("desktopNavSearch");
const desktopProfileBtn = document.getElementById("desktopNavProfile");
const desktopNavHome = document.getElementById('desktopNavHome'); // Will be <a>
const desktopNavStream = document.getElementById('desktopNavStream'); // Will be <a>
const desktopNavCategories = document.getElementById('desktopNavCategories'); // Will be <a>
const footerNav = document.querySelector('.footer-nav');
const profileMenu = document.getElementById("profileMenu");
const signInBtn = document.getElementById("signInBtn");
const facebookLink = document.getElementById("facebookLink");
const aboutBtn = document.getElementById("aboutBtn");
const playerBackLandscapeBtn = document.getElementById('playerBackLandscapeBtn');
const playerInfoOverlay = document.getElementById('playerInfoOverlay');
const playerOverlayLogo = document.getElementById('playerOverlayLogo');
const playerOverlayChannelName = document.getElementById('playerOverlayChannelName');
const playerOverlayCategoryText = document.getElementById('playerOverlayCategoryText');
const homeTrendingTodayBtn = document.getElementById('homeTrendingTodayBtn');
const homeTrendingWeekBtn = document.getElementById('homeTrendingWeekBtn');


// --- UTILITY FUNCTIONS --- (Keep slugify, getChannelBySlug, getCategoryByName)
function slugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[+&]/g, 'and')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}
function getChannelBySlug(slug) { return streams.find(s => slugify(s.name) === slug); }
// ... (other utility functions if you have more)

// --- REMOVE SPA ROUTING FUNCTIONS ---
// REMOVE: updateUrlAndTitle, handleRouteChange, _displayCorrectPageContent, _updateActiveUITab, switchTabAndUrl

// --- Feature Slider Logic (Keep as is, it's page-specific to home) ---
let featureIndex = 0; let featureSliderInterval = null; let slides = []; let features = [];
async function showTMDbDetails(id, mediaType) { /* ... same ... */ }
async function initializeFeatures() { /* ... same, but will only run if featureSlider exists ... */ }
function renderFeatureSlider() { /* ... same ... */ }
function goToSlide(index) { /* ... same ... */ }
function startFeatureSliderInterval() { /* ... same ... */ }

// --- CONTENT RENDERING --- (Keep these creation functions)
function createChannelCard(stream, index, viewContext, categorySlugContext = null) {
    const card = document.createElement("div");
    card.className = "channel-card";
    card.style.setProperty('--logo-url', `url('${stream.logo}')`);
    card.innerHTML = ` <img src="${stream.logo}" alt="${stream.name}" loading="lazy"/> <span class="material-symbols-outlined channel-live-icon">sensors</span> `;
    // MPA CHANGE: navigateToPlayChannel is simplified or might involve URL params if player is on a separate page.
    // For now, we assume player modal opens on the current page.
    card.onclick = () => openPlayerChannel(stream); // Simplified for MPA
    return card;
}
function createMovieCard(itemData) { /* ... same ... */ }
function createRankedTrendingCard(itemData, rank) { /* ... same ... */ }

function renderTopChannels() {
    if (!topChannelsRow) return; // Only render if on home page
    topChannelsRow.innerHTML = '<p class="loading-text">Loading channels...</p>';
    if (streams && streams.length > 0) {
        topChannelsRow.innerHTML = "";
        streams.slice(0, 12).forEach((stream, index) => {
            topChannelsRow.appendChild(createChannelCard(stream, index, 'home-top-channels'));
        });
    } else {
        topChannelsRow.innerHTML = '<p class="loading-text">No channels available.</p>';
    }
}
function renderHomeTrending(period = 'day') {
    if (!homeTrendingRow) return; // Only render if on home page
    fetchTMDbData(`/trending/all/${period}`, homeTrendingRow, 10, 'ranked');
}

const categoryOrder = ["ALL", "GENERAL", "NEWS", "MOVIES", "ENTERTAINMENT", "SPORTS", "KIDS", "LIFESTYLE + FOOD", "EDUCATIONAL", "NATURE + ANIMAL", "MUSIC", "RELIGION", "OVERSEAS", "ACTION + CRIME"];
const categoryIcons = { "ALL": "apps", "GENERAL": "tv_gen", "NEWS": "feed", "MOVIES": "movie", "ENTERTAINMENT": "theater_comedy", "SPORTS": "sports_soccer", "KIDS": "child_care", "LIFESTYLE + FOOD": "nightlife", "EDUCATIONAL": "school", "NATURE + ANIMAL": "pets", "MUSIC": "music_note", "RELIGION": "church", "OVERSEAS": "public", "ACTION + CRIME": "bolt", "UNCATEGORIZED": "category" };
function getIconForCategory(categoryName) { return categoryIcons[categoryName.toUpperCase().replace(/ /g, '_')] || categoryIcons["UNCATEGORIZED"]; }

function renderCategoryPills() {
    if (!categoryPillsContainer) return; // Only render if on categories page
    categoryPillsContainer.innerHTML = '';
    const uniqueCategories = ["ALL", ...new Set(streams.map(s => s.category || "UNCATEGORIZED"))];
    const sortedUniqueCategories = uniqueCategories.sort((a, b) => {
        const indexA = categoryOrder.indexOf(a.toUpperCase()); const indexB = categoryOrder.indexOf(b.toUpperCase());
        if (a === "ALL") return -1; if (b === "ALL") return 1;
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1; if (indexB !== -1) return 1;
        return a.localeCompare(b);
    });

    sortedUniqueCategories.forEach(catName => {
        const pill = document.createElement('button');
        pill.className = 'category-pill';
        // Check URL params for active category if implementing category filtering via URL
        // For simplicity here, we'll let the first pill be active or handle active state differently.
        // Or, better, have a default "ALL" and let renderCategories handle the initial load.
        if (catName === "ALL") pill.classList.add('active'); // Default ALL active
        pill.dataset.category = catName;
        pill.innerHTML = `<span class="material-symbols-outlined">${getIconForCategory(catName)}</span> ${catName}`;

        pill.onclick = () => {
            document.querySelectorAll('.category-pill.active').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            renderCategories(catName === "ALL" ? null : catName);
            // MPA: No URL update here for filtering, just re-render.
            // If you want filtering to be bookmarkable, you'd need URL params (e.g., live-tv.html?category=news)
            // and parse them on page load.
        };
        categoryPillsContainer.appendChild(pill);
    });
}

function renderCategories(filterCategory = null) {
    if (!categoryGroups) return; // Only render if on categories page
    // ... (rest of the renderCategories function is largely the same)
    // The createChannelCard's last two arguments (viewContext, categorySlugContext)
    // might be simplified or removed if player always opens on current page.
    // For now, pass 'live-tv' and the slug for context.
    categoryStreams.forEach((stream) => {
        channelsDiv.appendChild(createChannelCard(stream, streams.indexOf(stream), 'live-tv', slugify(cat)));
    });
    // ...
}

// --- PLAYER LOGIC --- (Largely the same, but URL manipulation for SPA is removed)
let shakaPlayer = null; let isPlayerActive = false; let currentPlayingChannelData = null; let shakaControlsObserver = null;
function syncCustomControlsVisibility() { /* ... same ... */ }
function setupShakaControlsObserver() { /* ... same ... */ }
async function initializeShakaPlayer(channel) { /* ... same ... */ }

// MPA Change: This function no longer changes the browser URL. It just opens the player.
// The 'context' arguments might be less relevant if player always opens on the current HTML page.
// function navigateToPlayChannel(channel, viewContext, categorySlugContext = null) {
//     openPlayerChannel(channel);
// }
// We can directly call openPlayerChannel from card clicks.

async function openPlayerChannel(channelData) {
    if (!playerContainer || !channelData) return;
    currentPlayingChannelData = channelData;
    // ... (rest of UI updates for player details are the same)
    closeProfileMenu();
    const playerInitialized = await initializeShakaPlayer(channelData);
    if (playerInitialized) {
        isPlayerActive = true;
        playerContainer.classList.add('expanded');
        playerContainer.classList.remove('minimized');
        bodyElement.classList.remove('player-minimized-active');
        try {
            if (shakaPlayerContainer.requestFullscreen) await shakaPlayerContainer.requestFullscreen();
            else if (shakaPlayerContainer.webkitRequestFullscreen) await shakaPlayerContainer.webkitRequestFullscreen();
            else if (shakaPlayerContainer.msRequestFullscreen) await shakaPlayerContainer.msRequestFullscreen();
            playerContainer.classList.add('fullscreen-active');
            syncCustomControlsVisibility();
        } catch (err) {
            console.warn("Fullscreen request failed:", err);
            playerContainer.classList.remove('fullscreen-active');
        }
    } else {
        isPlayerActive = false; currentPlayingChannelData = null;
        playerContainer.classList.remove('expanded', 'minimized', 'fullscreen-active', 'controls-active');
        bodyElement.classList.remove('player-minimized-active');
        playerLiveIconExpanded.style.display = 'none';
        // MPA: No automatic navigation back. The user is already on a page.
    }
}
async function expandPlayer() { /* ... same ... */ }
function minimizePlayer() { /* ... same ... */ }
if (playerBackLandscapeBtn) playerBackLandscapeBtn.onclick = minimizePlayer;
document.addEventListener('fullscreenchange', () => { /* ... same ... */ });

async function closePlayerCompletely(event = null, calledInternally = false) {
    if (event) event.stopPropagation();
    // MPA: No 'calledInternally' logic related to router.
    // if (!isPlayerActive && !calledInternally) return;
    if (!isPlayerActive) return;


    const wasActive = isPlayerActive;
    isPlayerActive = false;

    // ... (rest of player shutdown logic is the same) ...

    // MPA: Remove URL manipulation logic
    // if (!calledInternally && wasActive) { ... }
}


// --- SEARCH & PROFILE --- (Largely the same)
// The navigateToPlayChannel inside search results will just call openPlayerChannel.
// Example modification for search result channel click:
// onclickAction = () => { openPlayerChannel(streamData); closeSearchModal(); };

let searchDebounceTimer; const DEBOUNCE_DELAY = 400;
async function searchTMDb(query) { /* ... same ... */ }
function openSearchModal() { /* ... same ... */ }
function closeSearchModal() { /* ... same ... */ }
function trapFocusInSearch(event) { /* ... same ... */ }
function handleSearchInput() {
    clearTimeout(searchDebounceTimer);
    const query = searchInput.value.trim().toLowerCase();
    if (!query) { searchResultsModal.innerHTML = ""; searchLoadingIndicator.style.display = 'none'; return; }
    searchResultsModal.innerHTML = ""; searchLoadingIndicator.style.display = 'block';
    searchDebounceTimer = setTimeout(async () => {
        let streamResults = streams
            .filter(s => s.name && s.name.toLowerCase().includes(query))
            .map(s => ({ ...s, resultType: "Channel" }));
        let tmdbResults = await searchTMDb(query);
        let combinedResults = [...streamResults, ...tmdbResults].slice(0, 15);
        searchLoadingIndicator.style.display = 'none';
        if (combinedResults.length === 0) {
            searchResultsModal.innerHTML = `<p class="loading-text">No results found for "${searchInput.value}".</p>`;
            return;
        }
        searchResultsModal.innerHTML = "";
        combinedResults.forEach(r => {
            let cardHTML = '', onclickAction = null;
            const cardDiv = document.createElement('div');
            cardDiv.className = 'search-result-card';
            cardDiv.tabIndex = 0; // For accessibility
            switch (r.resultType) {
                case "Channel":
                    const streamData = streams.find(s => s.name === r.name && s.logo === r.logo);
                    if (streamData) {
                        onclickAction = () => {
                            openPlayerChannel(streamData); // Simplified for MPA
                            closeSearchModal();
                        };
                    }
                    cardHTML = `<img src="${r.logo || 'https://via.placeholder.com/50?text=No+Logo'}" alt="${r.name}"/><div class="search-result-info"><div class="search-result-title">${r.name}</div><div class="search-result-type">${r.resultType}</div></div>`;
                    break;
                case "TMDb":
                    // ... (TMDb search result card creation is the same)
                    break;
                default:
                    cardHTML = `<div>Unknown result type</div>`;
            }
            cardDiv.innerHTML = cardHTML;
            if (onclickAction) {
                cardDiv.onclick = onclickAction;
                cardDiv.onkeydown = (e) => { if (e.key === 'Enter') onclickAction(); };
            }
            searchResultsModal.appendChild(cardDiv);
        });
    }, DEBOUNCE_DELAY);
}

function toggleProfileMenu(event) { /* ... same ... */ }
function closeProfileMenu() { /* ... same ... */ }
function setupProfileMenuActions() { /* ... same ... */ }


// --- TMDb Data Fetching --- (Keep as is)
async function fetchTMDbData(endpoint, containerElement, limit = 12, cardType = 'standard') { /* ... same ... */ }

// --- MPA INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    if (typeof shaka !== 'undefined') {
        shaka.polyfill.installAll();
        if (!shaka.Player.isBrowserSupported()) {
            console.warn('Browser not supported by Shaka Player.');
        }
    } else {
        console.error("Shaka Player library not found!");
    }

    // REMOVE GitHub Pages redirect for deep links logic, not needed for MPA in this way.
    // if (sessionStorage.redirect) { ... }

    // Setup common event listeners
    if (logoLink) { // logoLink is now an <a> tag, default behavior is fine.
        // If you want to prevent default and do something else, add e.preventDefault().
        // For GitHub pages, href="/flow.ph/" or href="./" should work.
    }
    if(mobileSearchBtn) mobileSearchBtn.onclick = openSearchModal;
    if(desktopSearchBtn) desktopSearchBtn.onclick = openSearchModal;
    if(searchInput) searchInput.oninput = handleSearchInput;

    setupProfileMenuActions(); // Common for all pages

    // Determine current page and initialize page-specific content
    const currentPagePath = window.location.pathname;

    // Update active state for desktop navigation
    document.querySelectorAll('.desktop-vertical-nav-item').forEach(item => {
        const itemHref = item.getAttribute('href');
        // Ensure basePath is included for comparison if repo name is part of the path
        const fullItemPath = basePath + (itemHref.startsWith('/') ? itemHref.substring(1) : itemHref);
        const expectedPathForRepo = basePath + (currentPagePath.replace(basePath, ''));


        if (item.href === window.location.href || // Exact match
           (itemHref === '/flow.ph/' && (currentPagePath === '/flow.ph/' || currentPagePath === '/flow.ph/index.html')) || // Home page variations
           (item.id === "desktopNavHome" && (currentPagePath === basePath + '/' || currentPagePath === basePath + '/index.html')) ||
           (item.id === "desktopNavStream" && currentPagePath === basePath + '/stream.html') ||
           (item.id === "desktopNavCategories" && currentPagePath === basePath + '/live-tv.html')
        ) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });


    if (homeSection) { // We are on the Home Page (index.html)
        if (featureSlider) initializeFeatures();
        if (topChannelsRow) renderTopChannels();
        if (homeTrendingRow) renderHomeTrending('day');
        if (homeTrendingTodayBtn && homeTrendingWeekBtn) {
            homeTrendingTodayBtn.addEventListener('click', () => { renderHomeTrending('day'); homeTrendingTodayBtn.classList.add('active'); homeTrendingWeekBtn.classList.remove('active'); });
            homeTrendingWeekBtn.addEventListener('click', () => { renderHomeTrending('week'); homeTrendingWeekBtn.classList.add('active'); homeTrendingTodayBtn.classList.remove('active'); });
        }
    } else if (plusPage) { // We are on the Stream Page (stream.html)
        if (tmdbNowPlayingMoviesRow) fetchTMDbData('/movie/now_playing', tmdbNowPlayingMoviesRow, 12, 'standard');
        if (tmdbTopRatedMoviesRow) fetchTMDbData('/movie/top_rated', tmdbTopRatedMoviesRow, 12, 'standard');
        if (tmdbAiringTodayTVRow) fetchTMDbData('/tv/airing_today', tmdbAiringTodayTVRow, 12, 'standard');
        if (tmdbTopRatedTVRow) fetchTMDbData('/tv/top_rated', tmdbTopRatedTVRow, 12, 'standard');
    } else if (categoriesPage) { // We are on the Categories Page (live-tv.html)
        if (categoryPillsContainer) renderCategoryPills();
        if (categoryGroups) renderCategories(); // Render all by default
    }

    // REMOVE: window.addEventListener('popstate', handleRouteChange);
    // REMOVE: handleRouteChange(); // Initial call

    // Expose globally needed functions (keep these for onclick attributes in HTML)
    window.expandPlayer = expandPlayer;
    window.minimizePlayer = minimizePlayer;
    window.closePlayerCompletely = closePlayerCompletely;
    window.closeSearchModal = closeSearchModal;
    window.goToSlide = goToSlide; // If feature slider is on multiple pages
    window.closeProfileMenu = closeProfileMenu;
    window.showTMDbDetails = showTMDbDetails;
    // REMOVE: window.switchTabAndUrl = switchTabAndUrl;

    console.log("MPA Initialized. Current page:", window.location.pathname);
});