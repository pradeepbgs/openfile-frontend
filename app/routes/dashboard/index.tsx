import { Outlet, useNavigate } from "react-router";
import { useAuth } from "~/zustand/store";
import Sidebar from "~/components/sidebar";
import { useEffect } from "react";



const DashboardLayout = () => {
  const navigate = useNavigate()
  const user = useAuth.getState().user?.email
  useEffect(() => {
    if (!user) {
      navigate('/auth')
    }
  }, [])


  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 bg-gray-50 p-6 min-h-screen">
        <Outlet />
      </main>

    </div>
  );
};

export default DashboardLayout;
