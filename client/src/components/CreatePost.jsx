import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { Textarea } from './ui/textarea';
import { readFileAsDataURL } from '@/lib/utils';


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