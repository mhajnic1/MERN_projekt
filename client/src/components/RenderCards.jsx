import React from 'react';
import Card from './Card'; // Import the Card component

const RenderCards = ({ data, title }) => {
  // Check if there is data to display
  if (!data || data.length === 0) {
    return <h2 className="font-medium text-[#666e75] text-xl">{title}</h2>;
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {data.map((post) => (
        <Card
          key={post._id}
          _id={post._id}
          name={post.name}
          prompt={post.prompt}
          photo={post.photo} // Fallback image if photo is not available
          initialLikes={0}
          initialComments={0}
        />
      ))}
    </div>
  );
};

export default RenderCards;
