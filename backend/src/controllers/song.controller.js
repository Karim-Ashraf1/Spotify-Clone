import { Song } from "../models/song.model.js";

export const getAllSongs = async (req, res, next) => {
    try {
        // -1 = Desending => newest first
        // 1 = Ascending => oldest first
        const songs = await Song.find().sort({createdAt: -1});
        res.status(200).json(songs);
    } catch (error) {
        next(error);
    }
}



export const getFeaturedSongs = async (req, res, next) => {
    try {
        // featch 6 random songs using mongodb's aggregation pipeline
        console.log('Fetching featured songs...');
        const songs = await Song.aggregate([
            {
                $sample: { size: 6 }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                }
            }
        ]);
        console.log('Featured songs fetched:', songs.length);
        res.status(200).json(songs);
    } catch (error) {
        console.error('Error fetching featured songs:', error);
        res.status(500).json({ message: 'Failed to fetch featured songs', error: error.message });
    }
}

export const getMadeForYouSongs = async (req, res, next) => {
    try {
        console.log('Fetching made-for-you songs...');
        const songs = await Song.aggregate([
            {
                $sample: { size: 4 }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                }
            }
        ]);
        console.log('Made-for-you songs fetched:', songs.length);
        res.status(200).json(songs);
    } catch (error) {
        console.error('Error fetching made-for-you songs:', error);
        res.status(500).json({ message: 'Failed to fetch made-for-you songs', error: error.message });
    }
}


export const getTrendingSongs = async (req, res, next) => {
    try {
        console.log('Fetching trending songs...');
        const songs = await Song.aggregate([
            {
                $sample: { size: 4 }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                }
            }
        ]);
        console.log('Trending songs fetched:', songs.length);
        res.status(200).json(songs);
    } catch (error) {
        console.error('Error fetching trending songs:', error);
        res.status(500).json({ message: 'Failed to fetch trending songs', error: error.message });
    }
}
