'use client';
import AdminPosts from '@/components/admin/AdminPosts';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const AdminPage = () => {
    const {data: session, status} = useSession();
    const [activeTab, setActiveTab] = useState('users');
    const router = useRouter();
    useEffect(() => {
        console.log(session);
        if(status === 'unauthenticated' || session?.user?.role !== 'admin'){
            router.push('/');
        }
    }, [session, status]);

    const renderTab = () => {
        switch (activeTab) {
            case 'users' :
                return <UsersTab />
            case 'posts':
                return <PostsTab />
            case 'anaytics':
                return <AnalyticsTab />
            default: 
              return null    

        }
    }

  return (
    <div className="p-6 max-w-[80%] w-full mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      {/* Next: Add tabs for Users, Posts, Analytics */}
      <div className='w-fit'>
      <div className="flex gap-4 mb-6 bg-[#2d2d2d] text-gray-200 justify-center items-center py-4 px-10 rounded-2xl">
        <button onClick={() => setActiveTab('users')} className={`${activeTab === 'users' ? 'font-bold underline' : ''} cursor-pointer`}>Users</button>
        <button onClick={() => setActiveTab('posts')} className={`${activeTab === 'posts' ? 'font-bold underline' : ''} cursor-pointer`}>Posts</button>
        <button onClick={() => setActiveTab('analytics')} className={`${activeTab === 'anaytics' ? 'font-bold underline' : ''} cursor-pointer`}>Analytics</button>
      </div>
      </div>

      {renderTab()}
    </div>
  )
}

function UsersTab() {
    const [users, setUsers] = useState([])
    const [deleteId, setDeleteId] = useState(null)
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, userId: null, userName: '' })
  
    useEffect(() => {
      const fetchUsers = async () => {
        const res = await fetch('/api/admin/users')
        const data = await res.json()
        setUsers(data.users)
      }
  
      fetchUsers()
    }, [])
  
    const handleDelete = async (id) => {
      setDeleteId(id)
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
      const data = await res.json();
      setUsers(users.filter(user => user._id !== id))
      setDeleteId(null)
      setConfirmModal({ isOpen: false, userId: null, userName: '' })
    }

    const openDeleteModal = (userId, userName) => {
      setConfirmModal({ isOpen: true, userId, userName })
    }

    const closeDeleteModal = () => {
      setConfirmModal({ isOpen: false, userId: null, userName: '' })
    }
  
    return (
      <div className="space-y-4 ">
        {users.map(user => (
          <div key={user._id} className="border p-4 rounded-xl hover:bg-gray-200 hover:text-black flex justify-start items-center gap-4 ">
            <img src={user.image} alt="profile image" className='w-[120px] h-[120px] rounded-xl border' />
            <div className=''>
            <p><strong>Name:</strong> {user.name || 'N/A'}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            {
                user.role !== 'admin' && (
                    <button
                    className="mt-2 bg-gray-300 text-black py-3 px-6 rounded-full border border-black cursor-pointer hover:bg-black hover:text-gray-200"
                    onClick={() => openDeleteModal(user._id, user.name || user.email)}
                  >
                    Delete User
                  </button>
                )
            }

            </div>

          </div>
        ))}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={() => handleDelete(confirmModal.userId)}
          title="Delete User"
          message={`Are you sure you want to delete "${confirmModal.userName}"? This will also delete all their posts and comments. This action cannot be undone.`}
          confirmText="Delete User"
          cancelText="Cancel"
          variant="danger"
          loading={deleteId === confirmModal.userId}
        />
      </div>
    )
  }

  function PostsTab() {
    return(
      <div>
        <AdminPosts />
      </div>
    )
  }
  

export default AdminPage
