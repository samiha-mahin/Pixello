import React from 'react';
import Posts from './Posts';

const Feed = () => {
  return (
    <div className="flex-1 my-6 px-4 sm:px-6 md:px-10 lg:px-20 flex flex-col items-center">
      <Posts />
    </div>
  );
};

export default Feed;
