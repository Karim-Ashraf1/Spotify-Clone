import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import { usePlayerStore } from "@/stores/usePlayerStore";
import Topbar from "@/components/Topbar";
import { Song, Album } from "@/types";

interface Artist {
  _id: string;
  name: string;
  imageUrl?: string;
}

interface SearchResults {
  songs: Song[];
  albums: Album[];
  artists: Artist[];
}

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setCurrentSong, initializeQueue } = usePlayerStore();

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axiosInstance.get(`/search?query=${encodeURIComponent(query)}`);
        const data = response.data as SearchResults;

        const formattedSongs = data.songs.map(song => ({
          ...song,
          albumId: song.albumId || null,
          createdAt: song.createdAt || new Date().toISOString(),
          updatedAt: song.updatedAt || new Date().toISOString()
        }));
        
        setResults({
          ...data,
          songs: formattedSongs
        });
        

        if (formattedSongs.length > 0) {
          initializeQueue(formattedSongs);
        }
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query, initializeQueue]);
  
  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
  };
  
  if (isLoading) {
    return (
      <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
        <Topbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }
  
  if (error) {
    return (
      <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
        <Topbar />
        <div className="text-center p-8">
          <p className="text-red-500">{error}</p>
        </div>
      </main>
    );
  }
  
  if (!results || (!results.songs.length && !results.albums.length && !results.artists.length)) {
    return (
      <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
        <Topbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-8">Search Results for {query}</h1>
          <p className="text-center text-gray-400">No results found. Try another search term.</p>
        </div>
      </main>
    );
  }
  
  return (
    <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <Topbar />
      <div className="container mx-auto px-4 py-8 overflow-y-auto max-h-[calc(100vh-80px)]">
        <h1 className="text-2xl font-bold mb-8">Search Results for "{query}"</h1>
        
        {results.songs.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Songs</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {results.songs.map((song) => (
                <div 
                  key={song._id} 
                  className="bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 transition cursor-pointer group"
                  onClick={() => handlePlaySong(song)}
                >
                  <div className="mb-3 aspect-square overflow-hidden rounded-md relative group">
                    <img 
                      src={song.imageUrl} 
                      alt={song.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button 
                        className="bg-green-500 rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform"
                        aria-label="Play song"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <h3 className="font-medium truncate">{song.title}</h3>
                  <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {results.artists.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Artists</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {results.artists.map((artist, index) => (
                <div 
                  key={index} 
                  className="bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 transition cursor-pointer text-center"
                >
                  <div className="mb-3 aspect-square overflow-hidden rounded-full mx-auto w-3/4">
                    <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
                      <span className="text-3xl">🎵</span>
                    </div>
                  </div>
                  <h3 className="font-medium truncate">{artist.name}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {results.albums.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Albums</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {results.albums.map((album) => (
                <div 
                  key={album._id} 
                  className="bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 transition cursor-pointer"
                >
                  <div className="mb-3 aspect-square overflow-hidden rounded-md">
                    <img 
                      src={album.imageUrl} 
                      alt={album.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium truncate">{album.title}</h3>
                  <p className="text-sm text-gray-400 truncate">{album.artist}</p>
                  <p className="text-xs text-gray-500">{album.releaseYear}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 