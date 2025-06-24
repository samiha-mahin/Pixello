import React, { useState } from 'react';
import Feed from './Feed';
import { Outlet } from 'react-router-dom';
import RightSidebarContent from './RightSidebarContent';
import { Dialog, DialogTrigger, DialogContent } from './ui/dialog';
import { Menu, MessageCircle } from 'lucide-react';
import { FaMale } from 'react-icons/fa';
import ChatPage from './ChatPage';

const Home = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('friends'); // friends or chat

  return (
    <div className="flex relative">
      {/* Menu Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="md:hidden absolute top-4 right-4 z-50 p-1 cursor-pointer ">
            <Menu />
          </button>
        </DialogTrigger>

        <DialogContent className="w-[90vw] max-w-md max-h-[80vh] overflow-y-auto rounded-lg p-4">
          {/* Tab Buttons */}
          <div className="flex justify-around mb-4 border-b pb-2">
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex px-4 py-1 rounded text-sm font-semibold ${
                activeTab === 'friends' ? 'bg-gray-100' : ''
              }`}
            >
             <span><FaMale size={18}/></span> Find Friends
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex gap-1 px-4 py-1 rounded text-sm font-semibold ${
                activeTab === 'chat' ? 'bg-gray-100' : ''
              }`}
            >
             <span><MessageCircle size={18}/></span> Chat
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'friends' && <RightSidebarContent />}
          {activeTab === 'chat' && <ChatPage/>}
        </DialogContent>
      </Dialog>

      {/* Feed Section */}
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>

      {/* Right Sidebar for desktop */}
      <div className="hidden md:block w-fit my-10 pr-32">
        <RightSidebarContent />
      </div>
    </div>
  );
};

export default Home;
