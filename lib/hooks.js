import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, postsApi, commentsApi, bookmarksApi, userApi, uploadApi, tagsApi } from './api';

// Query Keys
export const queryKeys = {
  adminUsers: ['admin', 'users'],
  adminPosts: ['admin', 'posts'],
  adminAnalytics: ['admin', 'analytics'],
  posts: ['posts'],
  post: (slug) => ['posts', slug],
  userPosts: (userId) => ['posts', 'user', userId],
  searchPosts: (query) => ['posts', 'search', query],
  comments: (postId) => ['comments', postId],
  bookmarks: ['bookmarks'],
  bookmark: (postId) => ['bookmarks', postId],
  tags: ['tags'],
};

// Admin Hooks
export const useAdminUsers = () => {
  return useQuery({
    queryKey: queryKeys.adminUsers,
    queryFn: adminApi.getUsers,
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers });
    },
  });
};

export const useAdminPosts = () => {
  return useQuery({
    queryKey: queryKeys.adminPosts,
    queryFn: adminApi.getPosts,
  });
};

export const useAdminAnalytics = () => {
  return useQuery({
    queryKey: queryKeys.adminAnalytics,
    queryFn: adminApi.getAnalytics,
  });
};

// Posts Hooks
export const usePosts = () => {
  return useQuery({
    queryKey: queryKeys.posts,
    queryFn: postsApi.getAll,
  });
};

export const usePost = (slug) => {
  return useQuery({
    queryKey: queryKeys.post(slug),
    queryFn: () => postsApi.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useUserPosts = (userId) => {
  return useQuery({
    queryKey: queryKeys.userPosts(userId),
    queryFn: () => postsApi.getByUser(userId),
    enabled: !!userId,
  });
};

export const useSearchPosts = (query) => {
  return useQuery({
    queryKey: queryKeys.searchPosts(query),
    queryFn: () => postsApi.search(query),
    enabled: !!query && query.length > 0,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPosts });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => postsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPosts });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPosts });
    },
  });
};

export const useIncrementViews = () => {
  return useMutation({
    mutationFn: postsApi.incrementViews,
  });
};

// Comments Hooks
export const useComments = (postId) => {
  return useQuery({
    queryKey: queryKeys.comments(postId),
    queryFn: () => commentsApi.getByPost(postId),
    enabled: !!postId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: commentsApi.create,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments(variables.postId) });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: commentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};

export const useLikeDislikeComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, data }) => commentsApi.likeDislike(commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};

// Bookmarks Hooks
export const useBookmarks = () => {
  return useQuery({
    queryKey: queryKeys.bookmarks,
    queryFn: bookmarksApi.getAll,
  });
};

export const useCheckBookmark = (postId) => {
  return useQuery({
    queryKey: queryKeys.bookmark(postId),
    queryFn: () => bookmarksApi.check(postId),
    enabled: !!postId,
  });
};

export const useAddBookmark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookmarksApi.add,
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmark(postId) });
    },
  });
};

export const useRemoveBookmark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookmarksApi.remove,
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmark(postId) });
    },
  });
};

// User Hooks
export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: userApi.updateProfile,
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: userApi.signup,
  });
};

// Upload Hook
export const useUpload = () => {
  return useMutation({
    mutationFn: uploadApi.upload,
  });
};

// Tags Hook
export const useTags = () => {
  return useQuery({
    queryKey: queryKeys.tags,
    queryFn: tagsApi.getAll,
  });
};
