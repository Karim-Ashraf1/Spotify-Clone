import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";

// Search function that returns songs and artists based on a query
export const searchContent = async (req, res, next) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    
    // Create case-insensitive regex for searching
    const searchRegex = new RegExp(query, 'i');
    
    // Search for songs
    const songs = await Song.find({
      $or: [
        { title: searchRegex },
        { artist: searchRegex }
      ]
    }).limit(10);
    
    // Search for albums
    const albums = await Album.find({
      $or: [
        { title: searchRegex },
        { artist: searchRegex }
      ]
    }).limit(10);
    
    // Get unique artists from songs and albums
    const songArtists = songs.map(song => song.artist);
    const albumArtists = albums.map(album => album.artist);
    const uniqueArtists = [...new Set([...songArtists, ...albumArtists])].filter(
      artist => artist.match(searchRegex)
    ).slice(0, 10);
    
    return res.status(200).json({
      songs,
      albums,
      artists: uniqueArtists.map(name => ({ name }))
    });
    
  } catch (error) {
    next(error);
  }
};

// Get search suggestions as user types
export const getSearchSuggestions = async (req, res, next) => {
  try {
    const { prefix } = req.query;
    
    if (!prefix) {
      return res.status(400).json({ message: "Prefix is required" });
    }
    
    const searchRegex = new RegExp('^' + prefix, 'i');
    
    // Get song title suggestions
    const songTitles = await Song.find({ title: searchRegex })
      .select('title -_id')
      .limit(5);
    
    // Get artist name suggestions
    const artists = await Song.find({ artist: searchRegex })
      .select('artist -_id')
      .limit(5);
    
    // Get album title suggestions
    const albumTitles = await Album.find({ title: searchRegex })
      .select('title -_id')
      .limit(5);
    
    const suggestions = {
      songTitles: songTitles.map(song => song.title),
      artists: [...new Set(artists.map(song => song.artist))],
      albumTitles: albumTitles.map(album => album.title)
    };
    
    return res.status(200).json(suggestions);
    
  } catch (error) {
    next(error);
  }
}; 