import { connectToDB } from "@/lib/mongodb";
import { Post } from "@/models/Post";
import { User } from "@/models/User";


export const DELETE = async(req, { params }) => {
    try {
        await connectToDB();
        const { id } = await params;

        const postedRelatedToThisUser = await Post.deleteMany({ author : id})
        console.log("User all posts deleted", postedRelatedToThisUser);
        const user = await User.findByIdAndDelete(id);
        if(!user) return Response.json({ message: 'User not found', status: 404});
        return Response.json({message: 'User has been deleted successfully', status: 200});
        
    } catch (error) {
        return Response.json({ error: 'Failed to delete user', status: 500});
    }
}