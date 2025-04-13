import mongoose, { model, models } from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
    content: {type: String, required: true},
}, {timestamps: true});

export const Post = models.Post || model('Post', PostSchema);