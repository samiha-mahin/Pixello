import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { User } from 'lucide-react'; // or any icon for profile
import RightSidebarContent from './RightSidebarContent';

const RightSidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      
      {/* Mobile Button + Dialog */}
      <div className="fixed bottom-4 right-4 md:hidden z-50">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="bg-white shadow rounded-full p-2">
              <User className="w-5 h-5" />
            </button>
          </DialogTrigger>
          <DialogContent
            className="w-[90vw] max-w-sm rounded-lg overflow-y-auto max-h-[80vh] p-0"
            onInteractOutside={() => setOpen(false)}
          >
            <RightSidebarContent />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default RightSidebar;
