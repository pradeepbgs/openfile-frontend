
import { useStorageUsedQuery, useUserLinksQuery } from "~/service/api";
import type { LinkItem } from "types/types";
import UserLinks from "~/components/user-links";
import UserStats from "~/components/user-stats";
import Spinner from "~/components/spinner";

function Profile() {
  const { data, isLoading, isError, refetch } = useUserLinksQuery();
  const { data: storageUsed, isLoading: storageUsedLoading, error: storageUsedError } = useStorageUsedQuery()

  if (isLoading) return <div className="min-h-screen flex justify-center items-center"><Spinner size={28} /></div>;

  if (isError) {
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
    <div className="min-h-screen bg-[#14151c] text-white px-4 md:px-10 py-10 md:py-5">


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
