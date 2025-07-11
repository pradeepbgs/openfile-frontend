import { FaPlus } from "react-icons/fa";
import { Link } from "react-router";
import { useStorageUsedQuery, useUserLinksQuery } from "~/service/api";
import type { LinkItem } from "types/types";
import UserLinks from "~/components/user-links";
import UserStats from "~/components/user-stats";
import Spinner from "~/components/spinner";

function Profile() {
  const { data, isLoading, error, refetch } = useUserLinksQuery();
  const { data: storageUsed, isLoading: storageUsedLoading, error: storageUsedError } = useStorageUsedQuery()

  if (isLoading) return <div className="min-h-screen flex justify-center items-center"><Spinner size={28} /></div>;

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-400 text-lg">Error loading links. Please try again later.</p>
      </div>
    );
  }

  const links: LinkItem[] = data?.links || [];

  const handleRefresh = async () => {
    await refetch();
  }

  return (
    <div className="min-h-screen bg-[#14151c] text-white px-4 md:px-10 py-6 md:py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="md:text-3xl text-[1.3rem] font-extrabold text-white">
          Welcome to your Dashboard
        </h1>
        <Link
          to="/dashboard/"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm transition-transform duration-300 hover:bg-indigo-700 hover:scale-105"
        >
          <FaPlus className="mr-2" /> Create
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="mb-8">
        <UserStats links={links} storageUsed={storageUsed?.storageUsed || 0} storageUsedLoading={storageUsedLoading} storageUsedError={storageUsedError} />
      </div>

      {/* Recent Links */}
      <div>
        <UserLinks links={links} handleRefresh={handleRefresh} />
      </div>
    </div>
  );
}

export default Profile;
