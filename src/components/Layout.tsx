import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {FileText, Home, MessageSquare,  Menu, X } from 'lucide-react';

export default function Layout() {

    const [isMenuOpen, setIsMenuOpen] = useState(true);

    return (
        <div className="flex h-screen">
            {/* Menu Toggle Button */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`fixed top-4 ${isMenuOpen ? 'left-56' : 'left-4'} z-50 p-2 rounded-md bg-white shadow-lg transition-all duration-200 hover:bg-gray-50`}
            >
                {isMenuOpen ? (
                    <X className="w-5 h-5 text-gray-600" />
                ) : (
                    <Menu className="w-5 h-5 text-gray-600" />
                )}
            </button>

            {/* Sidebar Navigation */}
            <nav className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${
                isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } z-40`}>
                <div className="p-4">
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
                        <li>
                            <NavLink
                                to="/files"
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                                        isActive
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`
                                }
                            >
                                <FileText className="w-5 h-5 mr-3" />
                                Archivos
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Main Content */}
            <main className={`flex-1 overflow-auto bg-gray-50 transition-all duration-200 ${
                isMenuOpen ? 'ml-64' : 'ml-0'
            }`}>
                <Outlet />
            </main>
        </div>
    );
}