import Sidebar from '@/components/Sidebar';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import ProfileCard from '@/components/dashboard/ProfileCard';

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/auth/signin');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <Sidebar />
          <div className="flex-1">
            <ProfileCard session={session} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
