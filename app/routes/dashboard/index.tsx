import { Outlet, useNavigate } from "react-router";
import { useAuth } from "~/zustand/store";
import Sidebar from "~/components/sidebar";



const DashboardLayout = () => {
  const navigate = useNavigate()
  const user = useAuth.getState().user?.email
  // if (!user) {
  //   return navigate('/auth')
  // }
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1bg-gray-200">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
