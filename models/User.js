import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unqiue: true
    },
    password: String,
    image: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    bookmarks: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }],
        default: []
    }
}, {timestamps: true});

// Force re-register model with updated schema
let User;
try {
    // Delete cached model if it exists
    if (mongoose.models.User) {
        delete mongoose.models.User;
    }
    User = mongoose.model('User', UserSchema);
} catch (e) {
    User = mongoose.model('User');
}

export { User };