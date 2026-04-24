import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Post } from "@/models/Post";

// GET - Get all unique tags with counts
export async function GET() {
    try {
        await connectToDB();
        
        // Aggregate to get unique tags with their counts
        const tagAggregation = await Post.aggregate([
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { name: "$_id", count: 1, _id: 0 } }
        ]);
        
        return NextResponse.json({ tags: tagAggregation });
    } catch (error) {
        console.error("Error fetching tags:", error);
        return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
    }
}
