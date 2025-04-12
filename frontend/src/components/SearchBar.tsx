import { useState, useEffect, useRef } from "react";
import { axiosInstance } from "../lib/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { usePlayerStore } from "../stores/usePlayerStore";
import { Song } from "@/types";

type Suggestion = {
  songTitles: string[];
  artists: string[];
  albumTitles: string[];
};

interface SearchResponse {
  songs: Array<{
    _id: string;
    title: string;
    artist: string;
    imageUrl: string;
    audioUrl: string;
    duration: number;
    albumId?: string | null;
    createdAt?: string;
    updatedAt?: string;
  }>;
  albums: any[];
  artists: any[];
}

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentSong } = usePlayerStore();
  
  useEffect(() => {
    if (location.pathname === '/search') {
      setShowSuggestions(false);
    }
  }, [location]);
  
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions(null);
      return;
    }
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/search/suggestions?prefix=${searchQuery}`);
        setSuggestions(response.data as Suggestion);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300) as unknown as number;
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length === 0) return;
    
    try {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };
  
  const handleSuggestionClick = async (suggestion: string, type: 'song' | 'artist' | 'album') => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    
    if (type === 'song') {
      try {
        const response = await axiosInstance.get(`/search?query=${encodeURIComponent(suggestion)}`);
        const data = response.data as SearchResponse;
        
        const song = data.songs.find((s) => s.title === suggestion);
        
        if (song) {
          const formattedSong: Song = {
            ...song,
            albumId: song.albumId || null,
            createdAt: song.createdAt || new Date().toISOString(),
            updatedAt: song.updatedAt || new Date().toISOString()
          };
          
          setCurrentSong(formattedSong);
        }
      } catch (error) {
        console.error("Error fetching song:", error);
      }
    }
    
    navigate(`/search?query=${encodeURIComponent(suggestion)}`);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const searchContainer = document.querySelector('.search-container');
      if (searchContainer && !searchContainer.contains(target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative w-full max-w-md search-container">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => suggestions && setShowSuggestions(true)}
          placeholder="Search songs, artists, or albums..."
          className="w-full p-2 pl-10 pr-4 rounded-full bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button 
          type="submit" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </button>
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </form>
      
      {showSuggestions && suggestions && (Object.values(suggestions).some(arr => arr.length > 0)) && (
        <div 
          className="absolute z-50 w-full mt-2 bg-zinc-900 rounded-md shadow-lg overflow-hidden"
          onMouseDown={(e) => e.preventDefault()}
        >
          {suggestions.songTitles.length > 0 && (
            <div className="p-2">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase px-2 mb-1">Songs</h3>
              <ul>
                {suggestions.songTitles.map((title, idx) => (
                  <li 
                    key={`song-${idx}`}
                    className="px-2 py-1 hover:bg-zinc-800 cursor-pointer rounded text-white flex items-center"
                    onClick={() => handleSuggestionClick(title, 'song')}
                  >
                    <span className="text-green-500 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </span>
                    {title}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {suggestions.artists.length > 0 && (
            <div className="p-2 border-t border-zinc-800">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase px-2 mb-1">Artists</h3>
              <ul>
                {suggestions.artists.map((artist, idx) => (
                  <li 
                    key={`artist-${idx}`}
                    className="px-2 py-1 hover:bg-zinc-800 cursor-pointer rounded text-white flex items-center"
                    onClick={() => handleSuggestionClick(artist, 'artist')}
                  >
                    <span className="text-purple-500 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    {artist}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {suggestions.albumTitles.length > 0 && (
            <div className="p-2 border-t border-zinc-800">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase px-2 mb-1">Albums</h3>
              <ul>
                {suggestions.albumTitles.map((title, idx) => (
                  <li 
                    key={`album-${idx}`}
                    className="px-2 py-1 hover:bg-zinc-800 cursor-pointer rounded text-white flex items-center"
                    onClick={() => handleSuggestionClick(title, 'album')}
                  >
                    <span className="text-blue-500 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                    {title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 