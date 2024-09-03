import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: "test user",
  },
  username: {
    type: String,
    default: "test com",
  },
  text: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const postSchema = new mongoose.Schema({
    userId: {
      type: String,
      //required: true,
    },
    username: {
        type: String,
        //required: true,
    },
    prompt: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: [commentSchema],
    
}, { timestamps:true, collection: 'posts' });

export default mongoose.model('Post', postSchema);


