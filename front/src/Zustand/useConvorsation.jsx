import { create } from 'zustand';

const userConvorsation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),

  messages: [],
setMessage: (updater) =>
  set((state) => {
    if (typeof updater === "function") {
      return { messages: updater(state.messages || []) };
    }
    return { messages: Array.isArray(updater) ? updater : [updater] };
  }),

}));

export default userConvorsation;
