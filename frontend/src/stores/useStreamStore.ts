import { create } from 'zustand';

interface StreamState {
  isStreaming: boolean;
  streamId: string | null;
  setIsStreaming: (isStreaming: boolean) => void;
  setStreamId: (streamId: string | null) => void;
}

export const useStreamStore = create<StreamState>((set) => ({
  isStreaming: false,
  streamId: null,
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  setStreamId: (streamId) => set({ streamId }),
})); 