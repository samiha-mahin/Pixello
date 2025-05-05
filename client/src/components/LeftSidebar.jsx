import { Bell, Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import axios from 'axios'
import { USER_API } from '@/utils/constant'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const LeftSidebar = () => {

    const navigate =  useNavigate();

    const logoutHandler = async() => {
        try {
            const res = await axios.get(`${USER_API}/logout`,{withCredentials:true} );
            if(res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const sidebarItems = [
        {icon: <Home/>, text: 'Home'},
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Explore" },
        { icon: <MessageCircle />, text: "Messages" },
        { icon: <Bell />, text: "Notifications" },
        { icon: <PlusSquare />, text: "Create" },
        {
            icon: (
                <Avatar className='w-6 h-6'>
                    <AvatarImage src="https://vz.cnwimg.com/wp-content/uploads/2023/12/Mikey-Madison.jpg?x95892" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: <LogOut />, text: "Logout" },
    ]
    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
            logoutHandler();
        } 
    }
  return (
    <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
          <div className='flex flex-col'>
                <h1 className='my-8 pl-3 font-bold text-xl'>LOGO</h1>
                <div>
                    {
                        sidebarItems.map((item, index) => (
                            <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-3 p-2 hover:bg-gray-200 rounded-md cursor-pointer'>
                                {item.icon}
                                <span className='text-sm '>{item.text}</span>
                            </div>
                        ))
                    }
                </div>
            </div>
    </div>
  )
}

export default LeftSidebar