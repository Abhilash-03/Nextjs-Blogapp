import Link from 'next/link';
import UserImage from './UserImage';
import LogoutButton from './LogoutButton';

const Sidebar = async() => {

  return (
    <div className='w-[14%] h-screen bg-gray-100 rounded-xl'>
    <div className='text-center flex flex-col justify-center items-center gap-4'>
      <UserImage />
      <ul className='text-black w-full p-2'>
        <Link href={'/dashboard/profile'}>
          <li className='bg-gray-800 text-gray-200 w-full px-4 py-2 rounded-full my-2 hover:bg-gray-700'>User Profile</li>
        </Link>
        <Link href={'/dashboard/createpost'}>
          <li className='bg-gray-800 text-gray-200 w-full px-4 py-2 rounded-full my-2 hover:bg-gray-700'>Create Post</li>
        </Link>
        <Link href={'/dashboard/allposts'}>
          <li className='bg-gray-800 text-gray-200 w-full px-4 py-2 rounded-full my-2 hover:bg-gray-700'>Posts</li>
        </Link>
      </ul>
      <LogoutButton />
    </div>  
  </div>
  )
}

export default Sidebar
