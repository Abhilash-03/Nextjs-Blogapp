import LogoutButton from '@/components/LogoutButton';
import Sidebar from '@/components/Sidebar';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import ProfileCard from '@/components/dashboard/ProfileCard';

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/auth/signin');

  return (
    <div className="min-h-[88vh] px-4 pb-16 pt-12">
      <div className="mx-auto flex max-w-7xl gap-8">
        <Sidebar />
        <div className="flex-1">
          <ProfileCard session={session} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
