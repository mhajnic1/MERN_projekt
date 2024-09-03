import mongoose from "mongoose";

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
    comments: {
      type: Array,
      default: [],
    }
}, { timestamps:true, collection: 'posts' });

export default mongoose.model('Post', postSchema);


