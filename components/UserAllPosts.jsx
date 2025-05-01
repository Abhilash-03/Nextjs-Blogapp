'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UserAllPosts = () => {
    const {data: session, status} = useSession();
    const [posts, setPosts] = useState([]);
    // console.log(session);
     const router = useRouter();

    useEffect(() => {
        if(status === 'unauthenticated') router.push('/auth/signin');

        if(session?.user?.id) {
           fetch(`/api/posts/user/${session.user.id}`)
           .then((res) => res.json())
           .then((data) => setPosts(data))
        }
    }, [session, status]);

    const handleDelete = async(id) => {
       try {
         await fetch(`/api/posts/${id}`, { method: 'DELETE'});
         
       } catch (error) {
         console.log("Delete Post Error ", error.message);
       }
    }

  return (
    <div className="mt-10">
                    {posts.length === 0 ? (
                        <p>No posts yet!</p>
                    ) : (
                        <ul className="space-y-4">
                            {posts.map((post) => (
                                <li key={post._id} className="border p-4 rounded-2xl flex justify-between items-center px-4">
                                    <div className="flex justify-start items-center gap-3">
                                     <img src={post.image} alt={'image'} className="w-32 h-20 rounded-xl" />
                                    <h2 className="text-lg font-semibold">{post.title}</h2>
                                    </div>
                                    <div className="flex space-x-4 mt-3">
                                        <button onClick={() => router.push(`/edit/${post.slug}`)} className="text-blue-500 cursor-pointer hover:bg-white px-6 py-2 rounded-xl transition-all duration-200 ease-in">Edit</button>
                                        <button onClick={() => handleDelete(post._id)} className="text-red-500 cursor-pointer hover:bg-white px-6 py-2 rounded-xl transition-all duration-200 ease-in">Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
  )
}

export default UserAllPosts
