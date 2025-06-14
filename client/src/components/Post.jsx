import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { Button } from "./ui/button";
import CommentDialog from "./CommentDialog";
import { useSelector } from "react-redux";

const Post = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store)=> store.auth);
  const { posts } = useSelector((store)=> store.post);


  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if(inputText.trim()){
      setText(inputText);
    } else {
      setText("");
    }
  }

  return (
    <div className="my-6 px-4 w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto">
      {/* Top bar: Avatar and more menu */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src="https://vz.cnwimg.com/wp-content/uploads/2023/12/Mikey-Madison.jpg?x95892"
              alt="profile"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="text-sm sm:text-base font-medium">Mikey Maddison</h1>
        </div>

        {/* Dialog for actions */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {!isDialogOpen && (
            <DialogTrigger asChild>
              <MoreHorizontal className="cursor-pointer text-gray-600 hover:text-black transition duration-200 w-5 h-5 sm:w-6 sm:h-6" />
            </DialogTrigger>
          )}
          <DialogContent className="w-[70%] max-w-sm bg-white rounded-xl p-5 shadow-xl text-sm text-center space-y-3">
            <Button
              variant="ghost"
              className="w-full text-[#ED4956] font-semibold hover:bg-red-50"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="w-full hover:bg-gray-100">
              Add to favorites
            </Button>
            <Button variant="ghost" className="w-full hover:bg-gray-100">
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Image */}
      <img
        className="rounded-md my-3 w-full aspect-square object-cover"
        src="https://www.nme.com/wp-content/uploads/2024/10/Mikey-Madison-2024.jpg"
        alt="post"
      />
      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-5">
          <Heart className="cursor-pointer hover:text-gray-600" />
          <MessageCircle className="cursor-pointer hover:text-gray-600" />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block mb-2">100 likes</span>
      <p>
        <span className="font-medium mr-2">mikey_mad</span>
        caption
      </p>

      <span className="cursor-pointer text-sm text-gray-400">
        View all 20 comments
      </span>

      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          className="outline-none text-sm w-full"
        />
        {text && (
          <span
            className="text-[#3BADF8] cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
