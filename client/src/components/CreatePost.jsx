import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { Textarea } from './ui/textarea';
import { readFileAsDataURL } from '@/lib/utils';
import axios from 'axios';
import { Post_API } from '@/utils/constant';
import { setPosts } from '@/redux/postSlice';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false); // NEW
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const dispatch = useDispatch();

  const generateAICaption = async () => {
    try {
      setAiLoading(true);
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are an assistant that writes fun and creative captions for Instagram photos."
            },
            {
              role: "user",
              content: "Suggest a fun, catchy, creative caption for an Instagram photo."
            }
          ],
          max_tokens: 50,
          temperature: 0.8
        })
      });

      const data = await res.json();
      const aiCaption = data?.choices?.[0]?.message?.content?.trim();

      if (aiCaption) {
        setCaption(aiCaption);
        toast.success("AI Caption Generated!");
      } else {
        throw new Error("No caption returned");
      }
    } catch (error) {
      console.error("AI Caption Error:", error);
      toast.error("Failed to generate caption");
    } finally {
      setAiLoading(false);
    }
  };

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
      generateAICaption(); // GENERATE CAPTION ON IMAGE UPLOAD
    }
  };

  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post(`${Post_API}/addpost`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Post failed");
    } finally {
      setLoading(false);
      setFile("");
      setCaption("");
      setImagePreview("");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-centre font-semibold">Create Post</DialogHeader>
        <div className='flex items-center gap-3'>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt='' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-xs'>{user?.username}</h1>
          </div>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder='Write a caption...'
          className='focus-visible:ring-transparent border-none'
          rows={5}
        />
        {aiLoading && (
          <p className='text-sm text-blue-500 mt-1'>Generating caption...</p>
        )}

        {imagePreview && (
          <div className='w-full h-64 flex items-center justify-center'>
            <img src={imagePreview} alt="preview_img" className='object-cover h-full w-full rounded-md' />
          </div>
        )}

        <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} />
        <Link onClick={() => imageRef.current.click()} className='w-fit mx-auto text-black hover:text-blue-500 transition-colors duration-200'>Upload</Link>

        {imagePreview && (
          loading ? (
            <Button>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button onClick={createPostHandler} type="submit" className="w-full">Post</Button>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
