/**
 * This file allows you to map TMDB Movie IDs to your custom download/stream links.
 * You can get the Movie ID from the TMDB URL (e.g., https://www.themoviedb.org/movie/823464 -> ID is 823464)
 */

export const customLinks = {
    // Example: Deadpool & Wolverine
    "533535": {
        download: "https://example.com/downloads/deadpool_wolverine.mp4",
        stream: "https://example.com/stream/deadpool_wolverine.m3u8"
    },
    // Example: Joker: Folie à Deux
    "889737": {
        download: "https://example.com/downloads/joker_2.mp4",
        stream: "https://example.com/stream/joker_2.m3u8"
    },
    // Add more movies here following the format:
    // "MOVIE_ID": { download: "LINK", stream: "LINK" },
};
