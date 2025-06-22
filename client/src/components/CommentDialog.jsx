import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import Comment from './Comment';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts } from '@/redux/postSlice';
import { Post_API } from '@/utils/constant';

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText]   = useState('');
  const [comment, setComment] = useState([]);
  const { selectedPost, posts } = useSelector(store => store.post);
  const dispatch = useDispatch();

  /* ------------------------------------------------------------------ */
  /*  Load comments for the selected post                               */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (selectedPost) setComment(selectedPost.comments);
  }, [selectedPost]);

  /* ------------------------------------------------------------------ */
  /*  Input & submit handlers                                           */
  /* ------------------------------------------------------------------ */
  const changeEventHandler = e => setText(e.target.value);
  const sendMessageHandler = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        `${Post_API}/${selectedPost?._id}/comment`,
        { text },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );

      if (res.data.success) {
        const newComments     = [...comment, res.data.comment];
        const updatedPostData = posts.map(p =>
          p._id === selectedPost._id ? { ...p, comments: newComments } : p
        );

        setComment(newComments);
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  JSX                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        /* max-widths & layout switch at md breakpoint */
        className="p-0 flex flex-col md:flex-row w-[95vw] md:max-w-5xl h-[90vh] md:h-[80vh]"
      >
        {/* ---------- Image side ---------- */}
        <div className="w-full md:w-1/2 h-56 md:h-full flex-shrink-0">
          <img
            src={selectedPost?.image}
            alt="post_img"
            className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
          />
        </div>

        {/* ---------- Comment side ---------- */}
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex gap-3 items-center overflow-hidden">
              <Link>
                <Avatar>
                  <AvatarImage src={selectedPost?.author?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <Link className="font-semibold text-xs truncate">
                {selectedPost?.author?.username}
              </Link>
            </div>

            {/* more-options dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <MoreHorizontal className="cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="flex flex-col items-center text-sm text-center">
                <button className="w-full py-1 text-[#ED4956] font-bold">
                  Unfollow
                </button>
                <button className="w-full py-1">Add to favorites</button>
              </DialogContent>
            </Dialog>
          </div>

          <hr className="border-slate-100" />

          {/* Comments list */}
          <div className="flex-1 overflow-y-auto px-4 space-y-3">
            {comment.map(c => (
              <Comment key={c._id} comment={c} />
            ))}
          </div>

          {/* Input box */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <input
                value={text}
                onChange={changeEventHandler}
                placeholder="Add a comment..."
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none"
              />
              <Button
                disabled={!text.trim()}
                onClick={sendMessageHandler}
                variant="outline"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
