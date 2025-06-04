'use client';

import { act, useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import { useSession } from "next-auth/react";

const CommentItem = ({ comment, postId, depth = 0}) => {
  const {data: session} = useSession();
  const [showReply, setShowReply] = useState(false);
  const [likes, setLikes] = useState(comment.likes?.length || 0);
  const [dislikes, setDislikes] = useState(comment.dislikes?.length || 0);
  const [liked, setLiked] = useState(comment.likes?.includes(session?.user?._id))
  const [disliked, setDisliked] = useState(comment.dislikes?.includes(session?.user?._id))
  //  console.log("Comments ", comment._id);
  const handleLikeDislike = async(action) => {
    const res = await fetch(`/api/comments/${comment._id}/likeDislike`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({action})
    });
    const data = await res.json();
    
    if(res.ok) {
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setLiked(action === 'like');
      setDisliked(action === 'dislike');
    }

    if(action === 'like'){
      setLikes(comment.likes.length + 1);
      setDislikes(comment.dislikes.length);
    } else if(action === 'dislike'){
      setDislikes(comment.dislikes.length + 1);
      setLikes(comment.likes.length);
    }

  }


  return (
    <div className={`ml-[${depth * 20}px] border-l pl-4 mb-4`}>
      <div className="bg-black text-white p-3 rounded-md mt-2">
        <div className="flex gap-2 items-center">
          <img src={comment.userId?.image} alt="avatar" className="w-10 h-10 rounded-full border" />
          <strong>{comment.userId?.name}</strong>
        </div>
        <p className="mt-2 ml-5">{comment.content}</p>
        <div className="flex gap-4 text-sm mt-2">
          <button onClick={()=> setShowReply(!showReply)} className="text-blue-600">Reply</button>
          <button onClick={() => handleLikeDislike('like')}
            className={`${liked? 'text-blue-600 bg-green-500': 'text-gray-500  bg-white'}  px-5 py-2 rounded-full cursor-pointer`}
            >👍 {likes}</button>
          <button onClick={() => handleLikeDislike('dislike')}
            className={`${disliked? 'text-blue-600 bg-red-500': 'text-gray-500 bg-white'}  px-5 py-2 rounded-full cursor-pointer`}
            >👎 {dislikes}</button>
        </div>
      </div>
      {
        showReply && (
          <CommentForm  
          postId={postId}
          parentCommentId={comment._id}
          onSuccess={() => setShowReply(false)}
          />
        )
      }

      {/* Render replies recursively */}
      {comment.replies?.map(reply => (
        <CommentItem key={reply.id} comment={reply} postId={postId} depth={depth + 1} />
      ))}
    </div>
  )
}

export default CommentItem
