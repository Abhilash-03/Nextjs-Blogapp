'use client';

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

const CommentSection = ({ postId }) => {
  const {data: session} = useSession();
    const [comments, setComments] = useState([]);
    console.log('CommentSection ', postId);
    const fetchComments = async() => {
        const res = await fetch(`/api/comments?postId=${postId}`);
        const data = await res.json();
        console.log(data);
        setComments(data);
    }

    useEffect(() => {
         fetchComments();
    }, [postId])
  
  return (
    <section className="mt-10 space-y-6">
        <h2 className="text-2xl font-semibold">Comments</h2>
         {
            session ? (
             <CommentForm postId={postId} onSuccess={(newComment) => setComments([newComment, ...comments])} />
            ) : (
                <Link href={'/auth/signin'}>
                  <button className="border border-black hover:bg-black hover:text-white bg-gray-200 cursor-pointer text-black rounded-full text-lg px-10 py-4">Sign in</button>
                </Link>
            )
         }
         <div className="mt-10">
         {comments.map(comment => (
          <CommentItem key={comment._id} comment={comment} postId={postId} />
         ))}
         </div>
         
    </section>
  )
}

export default CommentSection
