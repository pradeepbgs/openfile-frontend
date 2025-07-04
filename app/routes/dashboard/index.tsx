import { Outlet, useNavigate } from "react-router";
import { useAuth } from "~/zustand/store";
import Sidebar from "~/components/sidebar";
import { useEffect } from "react";
import Footer from "~/components/footer";



const DashboardLayout = () => {
  const navigate = useNavigate()
  const user = useAuth.getState().user?.email

  // useEffect(() => {
  //   if (!user) navigate('/auth')
  // }, [])

  return (
    <div>
      <div className="relative flex min-h-screen bg-[#1a1b26]">
        <Sidebar />
        <main className="flex-1 bg-[#191b20] p-4 md:p-6 min-h-screen overflow-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};


export default DashboardLayout;
