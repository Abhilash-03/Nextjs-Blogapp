import { connectToDB } from "@/lib/mongodb";
import { Post } from "@/models/Post";
import { User } from "@/models/User";
import { Comment } from "@/models/Comment";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connectToDB();

        // Get total views from all posts
        const viewsResult = await Post.aggregate([
            { $group: { _id: null, totalViews: { $sum: "$views" } } }
        ]);
        const totalViews = viewsResult[0]?.totalViews || 0;

        // Get total posts count
        const totalPosts = await Post.countDocuments();

        // Get total users count
        const totalUsers = await User.countDocuments();

        // Get total comments count
        const totalComments = await Comment.countDocuments();

        // Get comments from last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentComments = await Comment.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        // Get users registered in last 7 days
        const recentUsers = await User.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        // Get posts created in last 7 days
        const recentPosts = await Post.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        // Get top posts by views
        const topPosts = await Post.find()
            .sort({ views: -1 })
            .limit(5)
            .select('title views slug createdAt')
            .populate('author', 'name');

        // Get recent activity (last 10 actions - users, posts, comments)
        const [latestUsers, latestPosts, latestComments] = await Promise.all([
            User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt'),
            Post.find().sort({ createdAt: -1 }).limit(5).select('title createdAt').populate('author', 'name'),
            Comment.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email').populate('postId', 'title')
        ]);

        // Combine and sort recent activity
        const recentActivity = [
            ...latestUsers.map(u => ({
                type: 'user',
                action: 'New user registered',
                user: u.email,
                time: u.createdAt
            })),
            ...latestPosts.map(p => ({
                type: 'post',
                action: `Post published: "${p.title?.substring(0, 30)}${p.title?.length > 30 ? '...' : ''}"`,
                user: p.author?.name || 'Unknown',
                time: p.createdAt
            })),
            ...latestComments.map(c => ({
                type: 'comment',
                action: `Comment on "${c.postId?.title?.substring(0, 25)}${c.postId?.title?.length > 25 ? '...' : ''}"`,
                user: c.userId?.email || 'Unknown',
                time: c.createdAt
            }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

        // Calculate engagement rate (comments + likes per view)
        const totalLikes = await Comment.aggregate([
            { $project: { likesCount: { $size: "$likes" }, dislikesCount: { $size: "$dislikes" } } },
            { $group: { _id: null, totalLikes: { $sum: "$likesCount" }, totalDislikes: { $sum: "$dislikesCount" } } }
        ]);
        const engagementInteractions = (totalLikes[0]?.totalLikes || 0) + (totalLikes[0]?.totalDislikes || 0) + totalComments;
        const engagementRate = totalViews > 0 ? ((engagementInteractions / totalViews) * 100).toFixed(1) : 0;

        return NextResponse.json({
            stats: {
                totalViews,
                totalPosts,
                totalUsers,
                totalComments,
                recentComments,
                recentUsers,
                recentPosts,
                engagementRate
            },
            topPosts,
            recentActivity
        });
    } catch (error) {
        console.log("Error fetching analytics", error.message);
        return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 });
    }
};
