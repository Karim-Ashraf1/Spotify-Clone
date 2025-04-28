import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface AuthStore {
	isAdmin: boolean;
	isLoading: boolean;
	error: string | null;
	isAuthenticated: boolean;

	checkAdminStatus: () => Promise<void>;
	checkAuthStatus: () => void;
	reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	isAdmin: false,
	isLoading: false,
	error: null,
	isAuthenticated: false,

	checkAdminStatus: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get<{ admin: boolean }>("/admin/check");
			set({ isAdmin: response.data.admin });
			
		} catch (error: any) {
			set({ isAdmin: false, error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	checkAuthStatus: () => {
		try {
			const token = localStorage.getItem('clerk-auth-token');
			set({ isAuthenticated: !!token });
		} catch (error) {
			set({ isAuthenticated: false });
		}
	},

	reset: () => {
		set({ isAdmin: false, isLoading: false, error: null, isAuthenticated: false });
	},
}));
