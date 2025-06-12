import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { Textarea } from './ui/textarea';
import { readFileAsDataURL } from '@/lib/utils';
import axios from 'axios';
import { Post_API } from '@/utils/constant';
import { setPosts } from '@/redux/postSlice';
import { toast } from 'sonner';


const CreatePost = ({open, setOpen}) => {
  const imageRef = useRef(); 
  //useRef() is a React Hook that lets you store a reference to a DOM element (like an <img>, <input>, or any HTML tag).
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(store => store.auth);
  const {posts} = useSelector(store => store.post);
  const dispatch = useDispatch();

  const fileChangeHandler = async(e) =>{
    const file = e.target.files?.[0]; //Gets the selected file
    if (file){                       //Checks if a file exists
      setFile(file);                //Saves the file in state
      const dataUrl = await readFileAsDataURL(file); //This converts the file into a Data URL 
      setImagePreview(dataUrl);  //Shows that image as a preview
    }
  }
  
  const createPostHandler = async(e) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if(imagePreview) formData.append("image",file);
    try {
      setLoading(true);
      const res = await axios.post(`${Post_API}/addpost`,formData,{
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      if(res.data.success){
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
      setFile("");
      setCaption("");
      setImagePreview("");
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent  onInteractOutside={()=> setOpen(false)}>
        <DialogHeader className="text-centre font-semibold" >Create Post</DialogHeader>
        <div className='flex items-center gap-3'>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt=''/>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-xs'>{user?.username}</h1>
            {/* <span className='text-gray-600 text-xs'>Bio here...</span> */}
          </div>
        </div>
        <Textarea>

        </Textarea>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost