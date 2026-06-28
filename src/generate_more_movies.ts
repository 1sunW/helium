
import missingMovies from './missing_movies.json';
import * as fs from 'fs';

const movies = missingMovies.map((movieFile, index) => {
  const titleMatch = movieFile.match(/^([^0-9\(\)]+)/);
  const title = titleMatch ? titleMatch[0].trim().replace(/-$/, '') : movieFile;

  return {
    id: `m-${index}`,
    title: title,
    description: 'Imported movie',
    type: 'movie' as const,
    image: 'https://placehold.co/300x400/png?text=Cover',
    genre: [],
    rating: 'N/A',
    duration: 'N/A',
    year: 'N/A',
    driveLink: '',
  };
});

const content = `
import { type ContentItem } from './data';

export const MORE_MOVIES: ContentItem[] = ${JSON.stringify(movies, null, 2)};
`;

fs.writeFileSync('src/more_movies.ts', content);
console.log("src/more_movies.ts generated.");
