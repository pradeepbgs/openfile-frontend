import { Outlet, useNavigate } from "react-router";
import { useAuth } from "~/zustand/store";
import Sidebar from "~/components/sidebar";
import { useEffect } from "react";
import Footer from "~/components/footer";
import SupportPage from "~/components/support";



const DashboardLayout = () => {
  const navigate = useNavigate()
  const user = useAuth.getState().user?.email

  useEffect(() => {
    if (!user) navigate('/auth')
  }, [])

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="relative flex min-h-screen ">
        <Sidebar />
        <main className="flex-1  p-4 md:p-6 min-h-screen overflow-auto">
          <SupportPage />
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};


export default DashboardLayout;
