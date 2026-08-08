import React, { useState, useEffect } from 'react';
import { Search, Film, Tv, Play, ExternalLink, Sparkles, ChevronRight, ChevronLeft, ShieldCheck } from 'lucide-react';

interface MovieResult {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
  media_type?: 'movie' | 'tv';
}

const API_KEY = "fb7bb23f03b6994dafc674c074d01761";

export const WATCH_SOURCES = [
  {
    id: "vidking",
    name: "VidKing (HD)",
    urls: {
      movie: "https://www.vidking.net/embed/movie/{id}",
      tv: "https://www.vidking.net/embed/tv/{id}/{season}/{episode}?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true"
    }
  },
  {
    id: "vidlink",
    name: "VidLink (Fast)",
    urls: {
      movie: "https://vidlink.pro/movie/{id}",
      tv: "https://vidlink.pro/tv/{id}/{season}/{episode}"
    }
  },
  {
    id: "vidsrcpro",
    name: "VidSrc.pro",
    urls: {
      movie: "https://vidsrc.pro/embed/movie/{id}",
      tv: "https://vidsrc.pro/embed/tv/{id}/{season}/{episode}"
    }
  },
  {
    id: "vidsrccc",
    name: "VidSrc.cc",
    urls: {
      movie: "https://vidsrc.cc/v2/embed/movie/{id}",
      tv: "https://vidsrc.cc/v2/embed/tv/{id}/{season}/{episode}"
    }
  },
  {
    id: "autoembed",
    name: "AutoEmbed",
    urls: {
      movie: "https://player.autoembed.cc/embed/movie/{id}",
      tv: "https://player.autoembed.cc/embed/tv/{id}/{season}/{episode}"
    }
  },
  {
    id: "videasy",
    name: "VidEasy",
    urls: {
      movie: "https://player.videasy.net/movie/{id}?color=8834ec",
      tv: "https://player.videasy.net/tv/{id}/{season}/{episode}?color=8834ec"
    }
  },
  {
    id: "smashystream",
    name: "SmashyStream",
    urls: {
      movie: "https://embed.smashystream.com/playere.php?tmdb={id}",
      tv: "https://embed.smashystream.com/playere.php?tmdb={id}&season={season}&episode={episode}"
    }
  },
  {
    id: "multiembed",
    name: "MultiEmbed",
    urls: {
      movie: "https://multiembed.mov/directstream.php?video_id={id}&tmdb=1",
      tv: "https://multiembed.mov/directstream.php?video_id={id}&tmdb=1&s={season}&e={episode}"
    }
  },
  {
    id: "twoembed",
    name: "2Embed",
    urls: {
      movie: "https://www.2embed.cc/embed/{id}",
      tv: "https://www.2embed.cc/embedtv/{id}&s={season}&e={episode}"
    }
  }
];

export const DIRECT_STREAM_SITES = [
  { name: 'VidKing', url: 'https://www.vidking.net' },
  { name: 'VidLink', url: 'https://vidlink.pro' },
  { name: 'VidSrc.pro', url: 'https://vidsrc.pro' },
  { name: 'FlixHQ', url: 'https://flixhq.to' },
  { name: 'AutoEmbed', url: 'https://autoembed.cc' },
  { name: '123Movies', url: 'https://123movies.net' },
  { name: 'SmashyStream', url: 'https://smashystream.com' }
];

interface MovieEmbedPlayerProps {
  initialQuery?: string;
  onOpenExternal?: (url: string) => void;
}

export default function MovieEmbedPlayer({ initialQuery = '', onOpenExternal }: MovieEmbedPlayerProps) {
  const [activeTab, setActiveTab] = useState<'movie' | 'tv'>('movie');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<MovieResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Active watching selection
  const [selectedMedia, setSelectedMedia] = useState<MovieResult | null>(null);
  const [selectedSource, setSelectedSource] = useState(WATCH_SOURCES[0].id);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [totalSeasons, setTotalSeasons] = useState(1);
  const [episodesCount, setEpisodesCount] = useState(1);

  // Fetch movies or tv shows
  const fetchMedia = async () => {
    setLoading(true);
    try {
      let url = '';
      if (searchQuery.trim()) {
        url = `https://api.themoviedb.org/3/search/${activeTab}?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&page=${page}`;
      } else {
        url = `https://api.themoviedb.org/3/${activeTab}/popular?api_key=${API_KEY}&page=${page}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch (err) {
      console.error('Failed to fetch media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [activeTab, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMedia();
  };

  // Fetch TV details (seasons)
  const handleSelectMedia = async (item: MovieResult) => {
    setSelectedMedia(item);
    setSelectedSeason(1);
    setSelectedEpisode(1);

    if (activeTab === 'tv' || item.media_type === 'tv') {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${item.id}?api_key=${API_KEY}`);
        if (res.ok) {
          const data = await res.json();
          setTotalSeasons(data.number_of_seasons || 1);
        }
      } catch (e) {
        console.error('Error fetching TV details:', e);
      }
    }
  };

  // Build embed stream URL
  const getEmbedUrl = () => {
    if (!selectedMedia) return '';
    const sourceObj = WATCH_SOURCES.find(s => s.id === selectedSource) || WATCH_SOURCES[0];
    const isTv = activeTab === 'tv' || selectedMedia.media_type === 'tv';
    let template = isTv ? sourceObj.urls.tv : sourceObj.urls.movie;

    return template
      .replace('{id}', String(selectedMedia.id))
      .replace('{season}', String(selectedSeason))
      .replace('{episode}', String(selectedEpisode));
  };

  return (
    <div className="w-full flex flex-col gap-6 text-white font-sans">
      {/* Streaming Sites Shortcuts Banner */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-amber-500/20 shadow-xl flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-400">
          <Sparkles className="w-4 h-4 text-amber-400" /> Direct Streaming Sites (Open via Proxy)
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {DIRECT_STREAM_SITES.map((site) => (
            <button
              key={site.name}
              type="button"
              onClick={() => onOpenExternal ? onOpenExternal(site.url) : window.open(site.url, '_blank')}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 hover:bg-amber-500/10 text-xs font-bold text-zinc-300 hover:text-amber-300 transition-all flex items-center gap-1.5"
            >
              <span>{site.name}</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </button>
          ))}
        </div>
      </div>

      {/* Embedded Active Video Player */}
      {selectedMedia && (
        <div id="active-player" className="p-5 rounded-2xl bg-zinc-950 border border-amber-500/30 shadow-2xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-zinc-800">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Play className="w-5 h-5 text-amber-400 fill-amber-400" />
                {selectedMedia.title || selectedMedia.name}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {selectedMedia.release_date || selectedMedia.first_air_date ? new Date(selectedMedia.release_date || selectedMedia.first_air_date!).getFullYear() : ''}
                {(activeTab === 'tv' || selectedMedia.media_type === 'tv') && ` • Season ${selectedSeason}, Episode ${selectedEpisode}`}
              </p>
            </div>

            <button
              onClick={() => setSelectedMedia(null)}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
            >
              Close Player
            </button>
          </div>

          {/* Server Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[10px] uppercase font-bold text-zinc-500 whitespace-nowrap shrink-0">Server:</span>
            {WATCH_SOURCES.map((source) => (
              <button
                key={source.id}
                onClick={() => setSelectedSource(source.id)}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border shrink-0 ${
                  selectedSource === source.id
                    ? 'bg-amber-500 text-black border-amber-400 shadow-neon-gold'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {source.name}
              </button>
            ))}
          </div>

          {/* Season & Episode Controls for TV Shows */}
          {(activeTab === 'tv' || selectedMedia.media_type === 'tv') && (
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-extrabold text-amber-400">Seasons:</span>
                {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSelectedSeason(s);
                      setSelectedEpisode(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      selectedSeason === s
                        ? 'bg-amber-500 text-black'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    S{s}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-extrabold text-amber-400">Episodes:</span>
                {Array.from({ length: 24 }, (_, i) => i + 1).map((ep) => (
                  <button
                    key={ep}
                    onClick={() => setSelectedEpisode(ep)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      selectedEpisode === ep
                        ? 'bg-amber-500 text-black'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    Ep {ep}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Iframe Stream Stage */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-zinc-800 shadow-2xl">
            <iframe
              src={getEmbedUrl()}
              title={selectedMedia.title || selectedMedia.name}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture; camera; microphone; geolocation; display-capture; payment; *"
              allowFullScreen
            />
          </div>

          {selectedMedia.overview && (
            <p className="text-xs text-zinc-400 leading-relaxed italic bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/50">
              "{selectedMedia.overview}"
            </p>
          )}
        </div>
      )}

      {/* TMDB Search Bar & Category Switch */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search millions of ${activeTab === 'movie' ? 'movies' : 'TV shows'}...`}
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none transition-colors"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => { setActiveTab('movie'); setPage(1); }}
            className={`flex-1 sm:flex-initial px-4 py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'movie'
                ? 'bg-amber-500 text-black shadow-neon-gold'
                : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
            }`}
          >
            <Film className="w-4 h-4" /> Movies
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('tv'); setPage(1); }}
            className={`flex-1 sm:flex-initial px-4 py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'tv'
                ? 'bg-amber-500 text-black shadow-neon-gold'
                : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4" /> TV Shows
          </button>
        </div>
      </div>

      {/* Movie Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-zinc-500 font-bold uppercase tracking-wider animate-pulse">
          Searching &amp; Loading Streams...
        </div>
      ) : results.length === 0 ? (
        <div className="py-12 text-center text-xs text-zinc-500">
          No {activeTab === 'movie' ? 'movies' : 'TV shows'} found for "{searchQuery}".
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((item) => {
            const title = item.title || item.name || 'Untitled';
            const date = item.release_date || item.first_air_date;
            const year = date ? new Date(date).getFullYear() : '';
            const poster = item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500';

            return (
              <div
                key={item.id}
                onClick={() => handleSelectMedia(item)}
                className="group relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/80 hover:border-amber-500/50 transition-all cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="aspect-[2/3] w-full overflow-hidden bg-zinc-900 relative">
                  <img
                    src={poster}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />

                  <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur text-[10px] font-bold text-amber-400 border border-amber-500/20">
                    HD Stream
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                    <div className="w-12 h-12 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform">
                      <Play className="w-6 h-6 fill-black ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-3 space-y-1">
                  <h3 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {title}
                  </h3>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span>{year || (activeTab === 'movie' ? 'Movie' : 'TV Show')}</span>
                    <span className="text-amber-400/80 font-bold uppercase">Stream</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-900 text-xs">
        <button
          disabled={page <= 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          className="px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 disabled:opacity-40 font-bold hover:bg-zinc-900 flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <span className="text-zinc-500 font-extrabold text-[11px] uppercase tracking-wider">
          Page {page}
        </span>

        <button
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 font-bold hover:bg-zinc-900 flex items-center gap-1"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
