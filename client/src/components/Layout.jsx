import { Outlet, Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';

const Layout = () => {
    const { logout, user } = useContext(AuthContext);
    const location = useLocation();

    const handleLogout = () => {
        logout();
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden sm:flex">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <Users className="h-6 w-6 text-blue-600 mr-2" />
                    <h1 className="text-xl font-bold tracking-tight text-gray-900">Mini CRM</h1>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive
                                        ? 'bg-blue-50 text-blue-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center mb-4 px-2">
                        <div className="h-8 w-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <p className="ml-3 text-sm font-medium text-gray-700 truncate">
                            {user?.email}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto w-full">
                {/* Mobile Header */}
                <div className="sm:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
                    <div className="flex items-center">
                        <Users className="h-6 w-6 text-blue-600 mr-2" />
                        <span className="font-bold text-lg">Mini CRM</span>
                    </div>
                    <button onClick={handleLogout} className="text-gray-500 hover:text-red-600">
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-4 sm:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
