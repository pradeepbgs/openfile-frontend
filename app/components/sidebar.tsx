import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { FiHome, FiUser, FiSettings, FiChevronDown, FiMenu } from 'react-icons/fi'
import { useAuth } from '~/zustand/store';
import SidebarDropdown from './sidebar-dropdown';

const Tabs = [
  { name: "Home", path: "/dashboard", icon: <FiHome /> },
  { name: "Profile", path: "/dashboard/profile", icon: <FiUser /> },
  { name: "Settings", path: "/dashboard/settings", icon: <FiSettings /> },
];

export default function Sidebar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile toggle

  const user = useAuth.getState().user;

  return (
    <>
      {/* Hamburger for mobile */}
      {!sidebarOpen &&
        <button
          className="md:hidden p-3 text-2xl absolute left-2 z-50 bg-[#1e1e2f]"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FiMenu />
        </button>}

      <aside
        className={` flex flex-col justify-between gap-90
          fixed top-0 left-0 h-[100vh] w-64 bg-[#1a1b26] p-4 border-r-2 border-indigo-600 z-40 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:relative md:translate-x-0 
        `}
      > 
        <div className='text-white'>
          <h2 className="text-xl font-bold mb-4">
            <Link to={'/'}>OpenFile</Link>
          </h2>
          <nav className="flex flex-col space-y-2">
            {Tabs.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
                  ${isActive ? "bg-indigo-600 text-white font-semibold shadow"
                    : "text-gray-300 hover:bg-[#2a2b3d] hover:text-white"}`
                }
              >
                {tab.icon}
                <span>{tab.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* user icon */}
        <div
          className="py-3 rounded-lg bg-[#2a2b3d] text-white cursor-pointer hover:bg-[#34364a] transition-all p-2 relative"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <button className='flex gap-3 items-center w-full'>
            <img
              src={user?.avatar || 'https://ui-avatars.com/api/?name=User'}
              alt="User avatar"
              className="w-8 h-8 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="text-sm font-medium truncate">{user?.name || "Username"}</span>
            <FiChevronDown className={`ml-auto transform transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropdownOpen && <SidebarDropdown />}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
