import React, { useRef } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';
import { Textarea } from './ui/textarea';


const CreatePost = ({open, setOpen}) => {
  const imageRef = useRef();
  const {user} = useSelector(store => store.auth);
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