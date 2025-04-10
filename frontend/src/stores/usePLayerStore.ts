 import {create} from 'zustand';
 import {Song} from "@/types";

    interface PlayerStore {
        currentSong: Song | null;
        isPlaying: boolean;
        setCurrentSong: (song: Song) => void;
        setIsPlaying: (isPlaying: boolean) => void;