import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true
  },
  commentText: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500 //limited comment length
  },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  }
}, { timestamps: true });

export const Comment = mongoose.model('Comment', commentSchema); 