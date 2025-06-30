import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { FiHome, FiUser, FiSettings, FiChevronDown, FiLogOut } from 'react-icons/fi'
import { useAuth } from '~/zustand/store';
const Tabs = [
    {
        name: "Home",
        path: "/dashboard",
        icon: <FiHome />
    },
    {
        name: "Profile",
        path: "/dashboard/profile",
        icon: <FiUser />
    },
    {
        name: "Settings",
        path: "/dashboard/settings",
        icon: <FiSettings />
    },
]

function sidebar() {
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    const user = useAuth.getState().user
    const navigate = useNavigate();

    const handleLogout = () => {
        useAuth.getState().logout();
        navigate('/auth');
    };

    return (
        <aside className="w-65 bg-white p-4 border-r-2 border-gray-200 flex flex-col justify-between">
            <div>
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
              ${isActive
                                    ? "bg-black text-white font-semibold"
                                    : "text-gray-700 hover:bg-gray-100 hover:text-black"}`
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
                className="py-3 rounded-lg  duration-200 bg-gray-100 hover:bg-gray-200 
            transition-all p-2 relative"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                <button className='flex gap-3 items-center'>
                    <img
                        src={user?.avatar || 'https://ui-avatars.com/api/?name=User'}
                        alt="User avatar"
                        className="w-8 h-8 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                    <span className="text-sm font-medium">{user?.name || "Username"}</span>
                    <FiChevronDown className={`ml-auto transform transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                    <div className="absolute left-0 bottom-14 w-full bg-white border rounded-md shadow-lg z-10">
                        <ul className="py-2 text-sm text-gray-700">
                            <li>
                                <button
                                    onClick={() => navigate('/dashboard/profile')}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    My Profile
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/dashboard/settings')}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    Settings
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <FiLogOut /> Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </aside>
    )
}

export default React.memo(sidebar)