# Project: "CineFlow" - Automated Movie Discovery & Streaming Portal
**Goal:** A React-based web application that automatically fetches movie metadata and provides streaming/download links via third-party aggregators.

---

## 1. Business Requirements (The "Logic")

### A. Full Automation (The "Hands-Off" Goal)
* **Metadata Sync:** Automatically fetch movie posters, trailers, ratings, and synopses from a global database.
* **No Manual Entry:** The system should update its "Trending" and "New Releases" sections daily without human intervention.
* **Auto-Categorization:** Sort movies by Genre, Year, and Rating automatically.

### B. User Experience & Streaming
* **Multi-Source Player:** Provide an embedded video player that pulls from multiple server sources (to ensure if one link is down, another works).
* **Search & Filter:** A robust search bar and filters for "Top Rated," "Popular," and "Upcoming."
* **Responsive Design:** Must work perfectly on mobile devices, as most movie streaming happens on phones.

### C. Compliance & Safety (Crucial)
* **Disclaimer:** A clear legal disclaimer stating the site does not host files but merely links to external sources.
* **Report System:** A way for users to report broken links so they can be filtered out.

---

## 2. Technical Requirements (The "Stack")

### A. Frontend Stack
* **Framework:** React.js (via Vite) for a lightning-fast Single Page Application (SPA).
* **State Management:** React Context API or Redux Toolkit to manage movie data across the site.
* **Routing:** `react-router-dom` to handle dynamic URLs (e.g., `/movie/12345`).
* **Styling:** Tailwind CSS for a Netflix-style dark UI.

### B. The "Automation" Engine (APIs)
* **Metadata Source:** [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api). This provides the titles, descriptions, and images.
* **Streaming Source:** Integration of third-party embed APIs (e.g., Vidsrc, 2Embed, or similar aggregators) that match movies by their `tmdb_id`.

### C. Key Components to Build
1.  **MovieCard:** A reusable component displaying the poster, title, and rating.
2.  **Hero Slider:** An automated slider on the homepage showing the top 5 trending movies.
3.  **Video Player Page:** A dynamic page that takes a Movie ID and loads the corresponding embed player.
4.  **Skeleton Screens:** To show "loading" states while the API is fetching data.

---

## 3. Implementation Steps

1.  **Initialize Project:** `npm create vite@latest cineflow --template react`.
2.  **API Integration:** Create a `services/api.js` file to handle all `fetch` requests to TMDB.
3.  **Dynamic Routing:** Set up routes so that clicking a movie card opens a detailed view based on the ID.
4.  **The "Stream" Logic:** Use an `<iframe>` to embed the video player, passing the movie's ID into the URL of the embed provider.
5.  **Deployment:** Deploy to Vercel or Netlify. (Note: These platforms may take down sites that violate copyright policies).

---

## 4. Maintenance & Scaling
* **Caching:** Use `react-query` to cache API responses so the site doesn't hit rate limits and loads faster for returning users.
* **SEO:** Use `react-helmet` to dynamically update page titles and meta tags for every movie to improve Google search rankings.