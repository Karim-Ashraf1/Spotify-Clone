import { Like } from "../models/like.model.js";
import { Song } from "../models/song.model.js";
import mongoose from "mongoose";

export const likeSong = async (req, res, next) => {
  try {
    const { songId } = req.body;
    const userId = req.auth.userId;

    if (!songId) {
      return res.status(400).json({ message: "Song ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ message: "Invalid song ID format" });
    }
    
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    const existingLike = await Like.findOne({ userId, songId });
    if (existingLike) {
      return res.status(400).json({ message: "You have already liked this song" });
    }

    const newLike = new Like({
      userId,
      songId
    });

    await newLike.save();

    res.status(201).json({
      message: "Song liked successfully",
      likeId: newLike._id
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already liked this song" });
    }
    next(error);
  }
};

export const unlikeSong = async (req, res, next) => {
  try {
    const { songId } = req.params;
    const userId = req.auth.userId;

    if (!songId) {
      return res.status(400).json({ message: "Song ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ message: "Invalid song ID format" });
    }

    const like = await Like.findOneAndDelete({ userId, songId });

    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }

    res.status(200).json({
      message: "Like removed successfully"
    });
  } catch (error) {
    next(error);
  }
};

export const checkLikeStatus = async (req, res, next) => {
  try {
    const { songId } = req.params;
    const userId = req.auth.userId;

    if (!songId) {
      return res.status(400).json({ message: "Song ID is required" });
    }

    const like = await Like.findOne({ userId, songId });
    
    res.status(200).json({
      isLiked: !!like
    });
  } catch (error) {
    next(error);
  }
};

export const getLikedSongs = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    const likes = await Like.find({ userId });
    const songIds = likes.map(like => like.songId);

    const likedSongs = await Song.find({ _id: { $in: songIds } });

    res.status(200).json(likedSongs);
  } catch (error) {
    next(error);
  }
}; 