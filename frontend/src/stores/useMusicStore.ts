import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MusicStore {
	songs: Song[];
	albums: Album[];
	isLoading: boolean;
	error: string | null;
	currentAlbum: Album | null;
	featuredSongs: Song[];
	madeForYouSongs: Song[];
	trendingSongs: Song[];
	stats: Stats;

	fetchAlbums: () => Promise<void>;
	fetchAlbumById: (id: string) => Promise<void>;
	fetchFeaturedSongs: () => Promise<void>;
	fetchMadeForYouSongs: () => Promise<void>;
	fetchTrendingSongs: () => Promise<void>;
	fetchStats: () => Promise<void>;
	fetchSongs: () => Promise<void>;
	deleteSong: (id: string) => Promise<void>;
	deleteAlbum: (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
	albums: [],
	songs: [],
	isLoading: false,
	error: null,
	currentAlbum: null,
	madeForYouSongs: [],
	featuredSongs: [],
	trendingSongs: [],
	stats: {
		totalSongs: 0,
		totalAlbums: 0,
		totalUsers: 0,
		totalArtists: 0,
	},

	deleteSong: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/songs/${id}`);

			set((state) => ({
				songs: state.songs.filter((song) => song._id !== id),
			}));
			toast.success("Song deleted successfully");
		} catch (error: any) {
			console.log("Error in deleteSong", error);
			toast.error("Error deleting song");
		} finally {
			set({ isLoading: false });
		}
	},

	deleteAlbum: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/albums/${id}`);
			set((state) => ({
				albums: state.albums.filter((album) => album._id !== id),
				songs: state.songs.map((song) =>
					song.albumId === state.albums.find((a) => a._id === id)?.title ? { ...song, album: null } : song
				),
			}));
			toast.success("Album deleted successfully");
		} catch (error: any) {
			toast.error("Failed to delete album: " + error.message);
		} finally {
			set({ isLoading: false });
		}
	},

	fetchSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get<Song[]>("/songs");
			set({ songs: response.data });
		} catch (error: any) {
			console.error("Error fetching songs:", error);
			set({ error: error?.response?.data?.message || "Failed to fetch songs" });
			toast.error("Failed to fetch songs");
		} finally {
			set({ isLoading: false });
		}
	},

	fetchStats: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get<Stats>("/stats");
			set({ 
				stats: response.data || {
					totalSongs: 0,
					totalAlbums: 0,
					totalUsers: 0,
					totalArtists: 0,
				}
			});
		} catch (error: any) {
			console.error("Error fetching stats:", error);
			set({ error: error?.response?.data?.message || "Failed to fetch stats" });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbums: async () => {
		set({ isLoading: true, error: null });

		try {
			const response = await axiosInstance.get<Album[]>("/albums");
			set({ albums: response.data });
		} catch (error: any) {
			console.error("Error fetching albums:", error);
			set({ error: error?.response?.data?.message || "Failed to fetch albums" });
			toast.error("Failed to fetch albums");
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbumById: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get<Album>(`/albums/${id}`);
			set({ currentAlbum: response.data });
		} catch (error: any) {
			console.error(`Error fetching album ${id}:`, error);
			set({ error: error?.response?.data?.message || "Failed to fetch album" });
			toast.error("Failed to fetch album details");
		} finally {
			set({ isLoading: false });
		}
	},

	fetchFeaturedSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get<Song[]>("/songs/featured");
			set({ featuredSongs: response.data });
		} catch (error: any) {
			console.error("Error fetching featured songs:", error);
			set({ error: error?.response?.data?.message || "Failed to fetch featured songs" });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchMadeForYouSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get<Song[]>("/songs/made-for-you");
			set({ madeForYouSongs: response.data });
		} catch (error: any) {
			console.error("Error fetching made for you songs:", error);
			set({ error: error?.response?.data?.message || "Failed to fetch personalized songs" });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchTrendingSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get<Song[]>("/songs/trending");
			set({ trendingSongs: response.data });
		} catch (error: any) {
			console.error("Error fetching trending songs:", error);
			set({ error: error?.response?.data?.message || "Failed to fetch trending songs" });
		} finally {
			set({ isLoading: false });
		}
	},
}));
