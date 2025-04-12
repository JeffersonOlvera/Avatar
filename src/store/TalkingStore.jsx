import { create } from "zustand";

const useAudioStore = create((set) => ({
  isTalking: false,
  setTalking: () => set({ isTalking: true }),
  stopTalking: () => set({ isTalking: false }),
}));

export default useAudioStore;
