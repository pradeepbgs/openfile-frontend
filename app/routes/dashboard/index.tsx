import { Link, NavLink, Outlet } from "react-router";


const Tabs = [
  {
    name: "Home",
    path: "/dashboard",
  },
  {
    name: "Profile",
    path: "/dashboard/profile",
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
  },
]

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-200 p-4">
        <h2 className="text-xl font-bold mb-4">
          <Link to={'/'}>OpenFile</Link>
        </h2>
        <nav className="space-y-2">
          {Tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md hover:bg-gray-800 hover:text-white ${isActive ? "bg-black text-white font-semibold" : ""}`
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-white">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
