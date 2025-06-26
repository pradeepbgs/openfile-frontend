import React from 'react'
import { Link, NavLink } from 'react-router'

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

function sidebar() {
    return (
        <aside className="w-65 bg-gray-200 p-4 border-r-2 border-e-gray-700">
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
    )
}

export default React.memo(sidebar)