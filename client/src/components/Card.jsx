import { useState } from 'react';
import { download } from '../assets';
import { downloadImage } from '../utils';
import FlexBetween from './FlexBetween'; // Import FlexBetween

const Card = ({ _id, username, prompt, photo, initialLikes = 0, initialComments = 0 }) => {

  // Local state for likes and comments
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);

  // Handle Like button click
  const handleLike = () => {
    setLikes(likes + 1);
    // You could also make an API call here to update the likes in your backend.
  };

  // Handle Comment button click
  const handleComment = () => {
    // For now, we'll just increment the comment count. You could expand this
    // to open a comment modal or text input for the user to submit a comment.
    setComments(comments + 1);
    // Similarly, you could make an API call here to update comments in your backend.
  };



  return (
    <div className="rounded-xl group relative shadow-card hover:shadow-cardhover card mb-6">
      {/* Post Image */}
      <img 
        className="w-full h-auto object-cover rounded-xl"
        src={photo}
        alt={prompt}
      />

      {/* Post Details */}
      <div className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-8 left-0 right-0 bg-[#10131f] m-2 p-4 rounded-md">
        <p className="text-white text-md overflow-y-auto prompt">{prompt}</p>

        {/* Name and Download Button */}
        <FlexBetween className="mt-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-green-700 flex justify-center items-center text-white text-xs font-bold">
              {name[0]}
            </div>
            <p className="text-white text-sm">{name}</p>
          </div>
          <button type="button" onClick={() => downloadImage(_id, photo)} className="outline-none bg-transparent border-none">
            <img src={download} alt="download" className="w-6 h-6 object-contain invert" />
          </button>
        </FlexBetween>
      </div>

      {/* Likes and Comments Section */}
      <FlexBetween className="mt-4 px-4">
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleLike} className="text-[#6469ff]">👍 Like</button>
          <span className="text-sm text-gray-500">{likes} Likes</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleComment} className="text-[#6469ff]">💬 Comment</button>
          <span className="text-sm text-gray-500">{comments} Comments</span>
        </div>
      </FlexBetween>
    </div>
  );
};

export default Card;
