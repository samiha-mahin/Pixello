import {
  Bell,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import axios from "axios";
import { USER_API } from "@/utils/constant";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LeftSidebar = () => {
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    }
    // Handle navigation (e.g., navigate("/explore"))
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <PlusSquare />, text: "Create" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Bell />, text: "Notifications" },
    {
      icon: (
        <Avatar className="w-5 h-5">
          <AvatarImage
            src="https://vz.cnwimg.com/wp-content/uploads/2023/12/Mikey-Madison.jpg?x95892"
            alt="@shadcn"
          />
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
        <h1 className="my-8 font-bold text-xl">LOGO</h1>
        <div className="flex flex-col gap-3">
          {sidebarItems.map((item, index) => (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
            >
              {item.icon}
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Navbar like Instagram */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 flex justify-around items-center h-14 z-50">
        {sidebarItems.slice(0, 6).map((item, index) =>
          item.text === "Messages" ||  item.text === "Explore" ? null : ( // remove bell
            <div
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className="flex flex-col items-center justify-center"
            >
              {item.icon}
            </div>
          )
        )}

        {/* Popover for Profile in place of Bell */}
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex flex-col items-center justify-center cursor-pointer">
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src="https://vz.cnwimg.com/wp-content/uploads/2023/12/Mikey-Madison.jpg?x95892"
                  alt="user"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate("/profile")}
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
      </div>
    </>
  );
};

export default LeftSidebar;
