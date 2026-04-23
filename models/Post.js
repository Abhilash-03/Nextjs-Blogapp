import mongoose, { model, models } from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {type: String, required: true, maxLength: 100},
    slug: {type: String, required: true, unique: true},
    content: {type: String, required: true},
    image: {
        type: String,
        default: 'https://thumbs.dreamstime.com/b/blogging-blog-concepts-ideas-worktable-blogging-blog-concepts-ideas-white-worktable-110423482.jpg'
    },
    author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    views: {type: Number, default: 0}
}, {timestamps: true});

export const Post = models.Post || model('Post', PostSchema);