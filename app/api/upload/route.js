import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { Readable } from 'stream';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(req) {
    const formData = await req.formData();
    
    const file = formData.get('image');
    if(!file) return NextResponse.json({ error: 'No file uploaded', status: 400});

    const buffer = Buffer.from(await file.arrayBuffer());
    const upload = await new Promise((resolve, reject) => {
         const stream = cloudinary.uploader.upload_stream(
            {folder: 'nextjs-blog/users'},
            (error, result) => {
                if(error) reject(error);
                else resolve(result);
            }
         )

         Readable.from(buffer).pipe(stream);
    })

    return NextResponse.json({ url: upload.secure_url });
}