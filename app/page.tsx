import Link from "next/link";

export default function Home() {
  return (
   <div className="text-center mt-10">
     <h2 className="text-7xl font-bold whitespace-nowrap text-slate-300 ">Welcome To My BloX!</h2>
     <p className="mt-3 text-2xl">Explore the latest articles</p>
     <Link href={'/blog'}>
       <button className="bg-white rounded-xl p-4 text-black w-[20%] cursor-pointer text-lg font-semibold mt-10 hover:bg-slate-300 hover:transition">Explore</button>
     </Link>
   </div>
  );
}
