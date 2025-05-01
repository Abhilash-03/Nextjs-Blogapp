import mongoose, { model, models } from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {type: String, required: true, maxLength: 100},
    slug: {type: String, required: true, unique: true},
    content: {type: String, required: true},
    image: String,
    author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

export const Post = models.Post || model('Post', PostSchema);