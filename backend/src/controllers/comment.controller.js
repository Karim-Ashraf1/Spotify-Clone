import { Comment } from "../models/comment.model.js";
import { Album } from "../models/album.model.js";
import mongoose from "mongoose";

export const addComment = async (req, res, next) => {
  try {
    const { albumId, commentText, parentCommentId } = req.body;
    const userId = req.auth.userId;

    if (!albumId || !commentText) {
      return res.status(400).json({ message: "Album ID and comment text are required" });
    }

    if (commentText.trim().length === 0) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    if (commentText.length > 500) {
      return res.status(400).json({ message: "Comment exceeds maximum length of 500 characters" });
    }

    if (!mongoose.Types.ObjectId.isValid(albumId)) {
      return res.status(400).json({ message: "Invalid album ID format" });
    }
    
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    if (parentCommentId) {
      if (!mongoose.Types.ObjectId.isValid(parentCommentId)) {
        return res.status(400).json({ message: "Invalid parent comment ID format" });
      }

      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
    }

    const newComment = new Comment({
      userId,
      albumId,
      commentText,
      parentCommentId: parentCommentId || null
    });

    await newComment.save();

    res.status(201).json({
      message: "Comment posted successfully",
      commentId: newComment._id
    });
  } catch (error) {
    next(error);
  }
};

export const getAlbumComments = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const { sort = "newest" } = req.query;

    if (!albumId) {
      return res.status(400).json({ message: "Album ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(albumId)) {
      return res.status(400).json({ message: "Invalid album ID format" });
    }
    
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    const sortOrder = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    const comments = await Comment.find({ albumId })
      .sort(sortOrder);

    const rootComments = comments.filter(comment => !comment.parentCommentId);
    const childComments = comments.filter(comment => comment.parentCommentId);
    

    const childCommentsByParentId = {};
    childComments.forEach(comment => {
      const parentId = comment.parentCommentId.toString();
      if (!childCommentsByParentId[parentId]) {
        childCommentsByParentId[parentId] = [];
      }
      childCommentsByParentId[parentId].push(comment);
    });

    const threaded = rootComments.map(rootComment => {
      const rootId = rootComment._id.toString();
      const replies = childCommentsByParentId[rootId] || [];
      
      return {
        ...rootComment.toObject(),
        replies
      };
    });

    res.status(200).json(threaded);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.auth.userId;

    if (!commentId) {
      return res.status(400).json({ message: "Comment ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID format" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this comment" });
    }

    await Comment.deleteMany({
      $or: [
        { _id: commentId },
        { parentCommentId: commentId }
      ]
    });

    res.status(200).json({
      message: "Comment deleted successfully"
    });
  } catch (error) {
    next(error);
  }
}; 