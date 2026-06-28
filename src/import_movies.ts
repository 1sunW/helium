
import { movieService } from './services/movieService';
import missingMovies from './missing_movies.json';

const OMDb_KEYS = ['thewdb', '26f54c2a', 'Plp911'];
const BATCH_SIZE = 20;

async function fetchPoster(title: string): Promise<string | null> {
  for (const key of OMDb_KEYS) {
    try {
      const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${key}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data.Response === 'True' && data.Poster && data.Poster !== 'N/A') {
          return data.Poster;
        }
      }
    } catch (e) {
      console.warn(`Failed to fetch poster for ${title} with key ${key}`, e);
    }
  }
  return "https://placehold.co/300x400/png?text=Cover";
}

async function importMovies() {
  const batch = missingMovies.slice(0, BATCH_SIZE);
  console.log(`Starting import of ${batch.length} movies...`);
  for (const movieFile of batch) {
    // Basic title extraction
    const titleMatch = movieFile.match(/^([^0-9\(\)]+)/);
    const title = titleMatch ? titleMatch[0].trim().replace(/-$/, '') : movieFile;

    try {
      const poster = await fetchPoster(title);
      const movieData = {
        title: title,
        description: "Imported movie",
        type: "movie" as const,
        image: poster,
        genre: [],
        rating: "N/A",
        duration: "N/A",
        year: "N/A",
        driveLink: "",
      };
      await movieService.addMovie(movieData);
      console.log(`Imported: ${title} (Cover: ${poster})`);
    } catch (e) {
      console.error(`Failed to import ${movieFile}:`, e);
    }
  }
  console.log("Import completed.");
}

importMovies();
