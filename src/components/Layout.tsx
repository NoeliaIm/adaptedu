import { Outlet, NavLink } from 'react-router-dom';
import { Home, MessageSquare } from 'lucide-react';

export default function Layout() {
    return (
        <div className="flex h-screen">
            {/* Sidebar Navigation */}
            <nav className="w-64 bg-white border-r border-gray-200 p-4">
                <div className="mb-8">
                    <h1 className="text-xl font-bold text-gray-800">School Management</h1>
                </div>
                <ul className="space-y-2">
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                                    isActive
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            <Home className="w-5 h-5 mr-3" />
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/chat"
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                                    isActive
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            <MessageSquare className="w-5 h-5 mr-3" />
                            Chat Assistant
                        </NavLink>
                    </li>
                </ul>
            </nav>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-gray-50">
                <Outlet />
            </main>
        </div>
    );
}