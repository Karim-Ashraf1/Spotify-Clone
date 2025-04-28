import { axiosInstance } from "../lib/axios";
import { Comment } from "../types";

interface AddCommentResponse {
  message: string;
  commentId: string;
}

interface DeleteCommentResponse {
  message: string;
}

export const commentService = {
  addComment: async (albumId: string, commentText: string, parentCommentId?: string): Promise<AddCommentResponse> => {
    const response = await axiosInstance.post("/comments", {
      albumId,
      commentText,
      parentCommentId
    });
    return response.data as AddCommentResponse;
  },

  getAlbumComments: async (albumId: string, sort: "newest" | "oldest" = "newest"): Promise<Comment[]> => {
    const response = await axiosInstance.get(`/comments/album/${albumId}`, {
      params: { sort }
    });
    return response.data as Comment[];
  },

  deleteComment: async (commentId: string): Promise<DeleteCommentResponse> => {
    const response = await axiosInstance.delete(`/comments/${commentId}`);
    return response.data as DeleteCommentResponse;
  }
}; 