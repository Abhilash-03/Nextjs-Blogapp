import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div className="text-center mt-10 flex flex-row-reverse w-full justify-between items-center">
    <div className="w-2/4">
      <Image src={'https://i.pinimg.com/736x/ad/83/3d/ad833d8017a0428397f28f41acfbc888.jpg'} alt="home-image" width={500} height={450} className="rounded-2xl" />
    </div>
    <div className="w-2/4">
     <h2 className="text-5xl font-bold text-slate-300 ">Welcome To My BloX!</h2>
     <p className="mt-3 text-2xl">Explore the latest articles</p>
     <Link href={'/blog'}>
     <button className="bg-white text-black rounded-xl px-10 py-4 cursor-pointer text-lg font-semibold hover:bg-black hover:text-white hover:border transition-all duration-300 ease-linear mt-4 w-1/3">Explore</button>
     </Link>
     <div className="subhead my-5 space-y-3">
        <h3 className="text-3xl font-semibold text-slate-200">What are you waiting for?</h3>
        <h4 className="text-2xl font-semibold text-slate-200">Create your first BloX</h4>
   </div>
     <div className="btns flex justify-center items-center gap-6 mt-10">
      {
        !session ? (
          <>
          <Link href={'/auth/signup'}>
            <button className="bg-white text-black rounded-xl px-10 py-4 cursor-pointer text-lg font-semibold">Sign up</button>
            </Link>
            <Link href={'/auth/signin'}>
            <button className="border border-white bg-[#1e1e1e] text-white rounded-xl px-10 py-4 cursor-pointer text-lg font-semibold">Sign in</button>
            </Link>
          </>
        ) : (
          <Link href={'/dashboard/createpost'}>
            <button className="bg-white text-black rounded-xl px-10 py-4 cursor-pointer text-lg font-semibold hover:bg-black hover:text-white hover:border transition-all duration-300 ease-linear">Create a Post</button>
           </Link>
        )
      }
      
     </div>
     </div>
   </div>

  );
}
