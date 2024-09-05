/* eslint-disable react/prop-types */
import Card from './Card';

const RenderCards = ({ data, title }) => {
  if (!data || data.length === 0) {
    return <h2 className="font-medium text-[#666e75] text-xl">{title}</h2>;
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {data.map((post) => (
        <Card
          key={post._id}
          _id={post._id}
          userId={post.userId}
          username={post.username}
          prompt={post.prompt}
          photo={post.photo}
          initialLikes={post.likes}
          initialComments={post.comments}
        />
      ))}
    </div>
  );
};

export default RenderCards;
