import { FaPlus } from "react-icons/fa"; 
import { Link } from "react-router";
import { useUserLinksQuery } from "~/service/api";
import type { LinkItem } from "types/types";
import UserLinks from "~/components/user-links";
import UserStats from "~/components/user-stats";
import Spinner from "~/components/spinner";


function Profile() {
  const { data, isLoading, error } = useUserLinksQuery();

  if(isLoading) return <Spinner size={28}/>

  if (error) {
    return (
      <div className="h-full flex justify-center items-center">
        <p className="text-red-500 text-lg">Error loading links. Please try again later.</p>
      </div>
    );
  }

  const links: LinkItem[] = data?.links || [];

  return (
    <div className="container mx-auto p-6 lg:p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="md:text-3xl text-[1.3rem] font-extrabold text-gray-800">Welcome to your Dashboard</h1>
        <Link
          to="/dashboard/"
          className="inline-flex items-center px-4 py-2 bg-black text-white 
          font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out 
          transform hover:scale-105"
        >
          <FaPlus className="mr-2" /> Create
        </Link>
      </div>

      {/* Quick Stats */}
      <UserStats links={links}/>

      {/* Recent Links */}
      <UserLinks links={links}/>
    </div>
  );
}

export default Profile;