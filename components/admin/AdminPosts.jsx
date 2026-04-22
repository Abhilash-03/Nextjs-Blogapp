'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import ConfirmModal from "@/components/ui/ConfirmModal";

const AdminPosts = () => {
    const [posts, setPosts] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, postId: null, postTitle: '' });
    const router = useRouter();

    useEffect(() => {
        const fetchPosts = async() => {
            const res = await fetch(`/api/admin/posts`);
            const data = await res.json();
            // console.log(data);
            setPosts(data.posts);
        }
        fetchPosts();
    }, [])

    const handleDelete = async(id) => {
       setDeleteId(id);
       const res = await fetch(`/api/posts/${id}`, { method: 'DELETE'});

       if(res.ok) {
        setPosts(posts.filter((post) => post._id !== id));
       }
       setDeleteId(null);
       setConfirmModal({ isOpen: false, postId: null, postTitle: '' });
    }

    const openDeleteModal = (postId, postTitle) => {
      setConfirmModal({ isOpen: true, postId, postTitle });
    };

    const closeDeleteModal = () => {
      setConfirmModal({ isOpen: false, postId: null, postTitle: '' });
    };

  return (
    <div className="p-4">
    <h2 className="text-xl font-semibold mb-4">All Posts</h2>
    <table className="w-full border text-left">
      <thead>
        <tr className="bg-gray-800 rounded-2xl">
          <th className="p-2">Post ID</th>
          <th className="p-2">Title</th>
          <th className="p-2">Author</th>
          <th className="p-2">Date</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => (
          <tr key={post._id} className="border-t">
            <td className="p-2">{post._id}</td>
            <td className="p-2">{post.title}</td>
            <td className="p-2">{post.author?.name || 'N/A'}</td>
            <td className="p-2">{new Date(post.createdAt).toLocaleDateString()}</td>
            <td className="p-2 space-x-2">
              <button
                onClick={() => router.push(`/edit/${post.slug}`)}
                className="bg-blue-500 px-3 py-1 text-white rounded cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => openDeleteModal(post._id, post.title)}
                className="bg-red-500 px-3 py-1 text-white rounded cursor-pointer"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Delete Confirmation Modal */}
    <ConfirmModal
      isOpen={confirmModal.isOpen}
      onClose={closeDeleteModal}
      onConfirm={() => handleDelete(confirmModal.postId)}
      title="Delete Post"
      message={`Are you sure you want to delete "${confirmModal.postTitle}"? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      variant="danger"
      loading={deleteId === confirmModal.postId}
    />
  </div>
  )
}

export default AdminPosts
