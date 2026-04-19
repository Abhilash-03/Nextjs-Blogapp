import { connectToDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { User } from "@/models/User";

export async function POST(req) {
    await connectToDB();
    const { name, email, password, image } = await req.json();

    if(!name || !email || !password) {
        return NextResponse.json({message: 'All fields are required' }, { status: 400 })
    }

    const exisitingUser = await User.findOne({ email });

    if(exisitingUser) {
        return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({name, email, password: hashed, image});
    await user.save();

    return NextResponse.json({ message: 'User registered successfully!' }, { status: 201 })
}