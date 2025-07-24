
import { useLinkCount, useStorageUsedQuery, useUserLinksQuery } from "~/service/api";
import type { LinkItem } from "types/types";
import UserLinks from "~/components/user-links";
import UserStats from "~/components/user-stats";
import Spinner from "~/components/spinner";
import { useEffect, useMemo, useState } from "react";

function Profile() {
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const { data, isLoading, isError, refetch } = useUserLinksQuery(page, limit);
  const { data: storageUsed, isLoading: storageUsedLoading, error: storageUsedError } = useStorageUsedQuery()
  const { data: LinkCounts } = useLinkCount()

  useEffect(() => {
    refetch();
  }, [page]);

  if (isLoading) return <div className="min-h-screen flex justify-center items-center"><Spinner size={28} /></div>;

  if (isError) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-400 text-lg">Error loading links. Please try again later.</p>
      </div>
    );
  }

  const handleRefresh = async () => {
    await refetch();
  }

  const { data: links, totalPages, page: currentPage } = data;


  const loadNextPage = async () => {
    setPage((prev) => {
      return prev + 1
    })
  }

  const loadPrevPage = async () => {
    setPage((prev) => prev - 1)
  }


  return (
    <div className="min-h-screen text-white px-4 md:px-10 py-10 md:py-5">
      {/* Stats */}
      <div className="mb-8">
        <UserStats
          links={links}
          storageUsed={storageUsed?.data?.storageUsed || 0}
          storageUsedLoading={storageUsedLoading}
          storageUsedError={storageUsedError}
          linkCount={LinkCounts?.links}
        />
      </div>

      {/* Recent Links */}
      <UserLinks
        links={links}
        handleRefresh={handleRefresh}
      />

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center gap-3">
        <button
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          onClick={loadPrevPage}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          onClick={loadNextPage}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>

  );
}

export default Profile;
