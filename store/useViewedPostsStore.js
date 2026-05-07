import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useViewedPostsStore = create(
  persist(
    (set, get) => ({
      // List of viewed post slugs
      viewedPosts: [],
      
      // Hydration flag
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      
      // Check if a post has been viewed
      hasViewed: (slug) => {
        return get().viewedPosts.includes(slug);
      },
      
      // Mark a post as viewed
      markAsViewed: (slug) => {
        const { viewedPosts } = get();
        if (!viewedPosts.includes(slug)) {
          set({ viewedPosts: [...viewedPosts, slug] });
        }
      },
      
      // Clear all viewed posts
      clearViewed: () => set({ viewedPosts: [] }),
    }),
    {
      name: 'viewed-posts-session',
      // Use sessionStorage - persists on reload, clears when tab closes
      storage: createJSONStorage(() => sessionStorage),
      // Only persist the viewedPosts field
      partialize: (state) => ({ viewedPosts: state.viewedPosts }),
      // Set hydrated flag when rehydration completes
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useViewedPostsStore;
