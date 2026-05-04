import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useDraftStore = create(
  persist(
    (set, get) => ({
      // Draft data
      draft: null,
      
      // Hydration flag - true once store is loaded from storage
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      
      // Save draft
      saveDraft: (data) => {
        // Only save if there's actual content
        const hasTitle = data.title?.trim()?.length > 0;
        const contentWithoutTags = data.content?.replace(/<[^>]*>/g, '').trim();
        
        if (!hasTitle && !contentWithoutTags) {
          return; // Don't save empty drafts
        }
        
        set({
          draft: {
            ...data,
            savedAt: Date.now(),
          }
        });
      },
      
      // Update server draft ID after syncing
      setDraftId: (id) => {
        const { draft } = get();
        if (draft) {
          set({ draft: { ...draft, serverId: id } });
        }
      },
      
      // Clear draft
      clearDraft: () => set({ draft: null }),
    }),
    {
      name: 'blog-draft-session',
      // Use sessionStorage - persists on reload, clears when tab closes
      storage: createJSONStorage(() => sessionStorage),
      // Only persist the draft field
      partialize: (state) => ({ draft: state.draft }),
      // Set hydrated flag when rehydration completes
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useDraftStore;
