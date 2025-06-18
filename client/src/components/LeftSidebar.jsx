import {
  Bell,
  Camera,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { USER_API } from "@/utils/constant";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "./CreatePost";
import { setAuthUser } from "@/redux/authSlice";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { likeNotification } = useSelector(
    (state) => state.realTimeNotification
  );

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const sidebarHandler = (text) => {
    if (text === "Logout") logoutHandler();
    else if (text === "Create") setOpen(true);
    else if (text === "Profile") navigate(`/profile/${user._id}`);
    else if (text === "Messages") navigate("/chat");
    else if (text === "Home") navigate("/");
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <PlusSquare />, text: "Create" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    {
      icon: <Bell />,
      text: "Notifications",
    },
    {
      icon: (
        <Avatar className="w-5 h-5">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed top-0 left-0 w-[16%] h-screen bg-white border-r p-4">
        <h1 className="my-8 font-bold text-2xl">Pixello</h1>
        <div className="flex flex-col gap-3">
          {sidebarItems.map((item, index) => {
            if (item.text === "Notifications") {
              return (
                <Popover key={index}>
                  <PopoverTrigger asChild>
                    <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer relative">
                      <Bell />
                      <span className="text-sm">Notifications</span>
                      {likeNotification.length > 0 && (
                        <div className="absolute left-5 top-1 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                          {likeNotification.length}
                        </div>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    {likeNotification.length === 0 ? (
                      <p className="text-sm text-center text-gray-500">
                        No new notifications
                      </p>
                    ) : (
                      likeNotification.map((notification) => (
                        <div
                          key={notification.userId}
                          className="flex items-center gap-2 my-2"
                        >
                          <Avatar>
                            <AvatarImage
                              src={notification.userDetails?.profilePicture}
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <p className="text-sm">
                            <span className="font-bold">
                              {notification.userDetails?.username}
                            </span>{" "}
                            liked your post
                          </p>
                        </div>
                      ))
                    )}
                  </PopoverContent>
                </Popover>
              );
            }

            return (
              <div
                key={index}
                onClick={() => sidebarHandler(item.text)}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
              >
                {item.icon}
                <span className="text-sm">{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Bottom Navbar */}
      <div className="md:hidden w-full flex justify-center my-4">
        <h1 className="font-bold text-2xl">Pixello</h1>
      </div>
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t flex justify-around items-center h-14 z-50">
        {sidebarItems.map((item, index) => {
          if (
            item.text === "Messages" ||
            item.text === "Explore" ||
            item.text === "Logout"
          )
            return null;

          if (item.text === "Notifications") {
            return (
              <Popover key={index}>
                <PopoverTrigger asChild>
                  <div className="relative flex flex-col items-center justify-center cursor-pointer">
                    <Bell />
                    {likeNotification.length > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                        {likeNotification.length}
                      </div>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  {likeNotification.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center">
                      No new notifications
                    </p>
                  ) : (
                    likeNotification.map((notification) => (
                      <div
                        key={notification.userId}
                        className="flex items-center gap-2 my-2"
                      >
                        <Avatar>
                          <AvatarImage
                            src={notification.userDetails?.profilePicture}
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <p className="text-sm">
                          <span className="font-bold">
                            {notification.userDetails?.username}
                          </span>{" "}
                          liked your post
                        </p>
                      </div>
                    ))
                  )}
                </PopoverContent>
              </Popover>
            );
          }

          if (item.text === "Profile") {
            return (
              <Popover key={index}>
                <PopoverTrigger asChild>
                  <div className="flex flex-col items-center justify-center cursor-pointer">
                    {item.icon}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-40">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/profile/${user._id}`)}
                      className="text-sm text-left hover:bg-gray-100 px-2 py-1 rounded"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => navigate("/settings")}
                      className="text-sm text-left hover:bg-gray-100 px-2 py-1 rounded"
                    >
                      Settings
                    </button>
                    <button
                      onClick={logoutHandler}
                      className="text-sm text-left hover:bg-gray-100 px-2 py-1 rounded text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            );
          }

          return (
            <div
              key={index}
              onClick={() => sidebarHandler(item.text)}
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              {item.icon}
            </div>
          );
        })}
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
};

export default LeftSidebar;
