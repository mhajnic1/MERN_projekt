import React from 'react';
import RenderCards from './RenderCards';

const PostList = ({ posts, searchText }) => {
  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-3xl">  {/* Controls the width and centering */}
        {searchText && (
          <h2 className="font-medium text-[#666e75] text-xl mb-3">
            Showing results for <span className="text-[#222328]">{searchText}</span>
          </h2>
        )}

        <RenderCards
          data={posts}
          title={searchText ? "No search results found" : "No posts found"}
        />
      </div>
    </div>
  );
};

export default PostList;
