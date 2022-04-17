import mongoose, { trusted } from 'mongoose';

const PostSchema = new mongoose.Schema({

    user: {
        type: 'ObjectId',
        ref: 'User'
    },
    titles: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model('post', PostSchema);

export default Post;