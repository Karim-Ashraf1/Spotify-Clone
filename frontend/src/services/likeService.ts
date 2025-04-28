import { axiosInstance } from "../lib/axios";
import { Song } from "../types";

interface LikeResponse {
  message: string;
  likeId: string;
}

interface UnlikeResponse {
  message: string;
}

interface LikeStatusResponse {
  isLiked: boolean;
}

export const likeService = {
  likeSong: async (songId: string): Promise<LikeResponse> => {
    const response = await axiosInstance.post("/likes", { songId });
    return response.data as LikeResponse;
  },

  unlikeSong: async (songId: string): Promise<UnlikeResponse> => {
    const response = await axiosInstance.delete(`/likes/${songId}`);
    return response.data as UnlikeResponse;
  },

  checkLikeStatus: async (songId: string): Promise<boolean> => {
    const response = await axiosInstance.get(`/likes/check/${songId}`);
    return (response.data as LikeStatusResponse).isLiked;
  },

  getLikedSongs: async (): Promise<Song[]> => {
    const response = await axiosInstance.get("/likes/songs");
    return response.data as Song[];
  }
}; 