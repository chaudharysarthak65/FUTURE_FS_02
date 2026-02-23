import { Outlet, Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, LogOut, Search, Bell, Moon, Sun, ChevronLeft, ChevronRight, Settings, BarChart2 } from 'lucide-react';

const Layout = () => {
    const { logout, user } = useContext(AuthContext);
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false); // Placeholder for dark mode toggle

    const handleLogout = () => {
        logout();
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Leads', path: '/leads', icon: Users },
        { name: 'Analytics', path: '/analytics', icon: BarChart2 },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-300`}>
            {/* Sidebar */}
            <aside
                className={`relative flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out z-20 ${isSidebarOpen ? 'w-64' : 'w-20'
                    } hidden sm:flex`}
            >
                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-3 top-6 bg-white border border-slate-200 rounded-full p-1 text-slate-400 hover:text-slate-600 hover:shadow-md transition-all z-30"
                >
                    {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {/* Logo Section */}
                <div className={`h-16 flex items-center ${isSidebarOpen ? 'px-6' : 'px-0 justify-center'} border-b border-slate-100`}>
                    <div className="bg-indigo-600 p-1.5 rounded-lg flex-shrink-0">
                        <Users className="h-5 w-5 text-white" />
                    </div>
                    {isSidebarOpen && (
                        <h1 className="ml-3 text-lg font-bold tracking-tight text-slate-800 fade-in">Mini CRM</h1>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        // For this demo, only '/' and routes starting with '/leads' might be active
                        const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.name}
                                to={item.path === '/leads' || item.path === '/analytics' || item.path === '/settings' ? '#' : item.path}
                                className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                        ? 'bg-indigo-50/80 text-indigo-600 shadow-sm'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                    }`}
                                title={!isSidebarOpen ? item.name : ''}
                            >
                                <Icon className={`flex-shrink-0 ${isSidebarOpen ? 'mr-3' : 'mx-auto'} ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} transition-colors ${isSidebarOpen ? 'h-5 w-5' : 'h-6 w-6'}`} />
                                {isSidebarOpen && <span className="fade-in">{item.name}</span>}
                                {isActive && isSidebarOpen && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer (User / Logout) */}
                <div className={`p-4 border-t border-slate-100 flex flex-col gap-2 ${!isSidebarOpen && 'items-center'}`}>
                    <div className="flex items-center gap-3 w-full px-2 py-2 rounded-xl border border-slate-100 bg-slate-50">
                        <div className="h-8 w-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 min-w-0 fade-in">
                                <p className="text-sm font-semibold text-slate-800 truncate">
                                    {user?.email?.split('@')[0] || 'Admin User'}
                                </p>
                                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative z-10 w-full overflow-hidden">
                {/* Mobile Header (Only visible on small screens) */}
                <div className="sm:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-20 relative">
                    <div className="flex items-center">
                        <div className="bg-indigo-600 p-1.5 rounded-lg flex-shrink-0 mr-2">
                            <Users className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-lg text-slate-800">Mini CRM</span>
                    </div>
                    <button onClick={handleLogout} className="text-slate-400 p-2 hover:bg-slate-50 rounded-lg">
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>

                {/* Desktop Top Navbar */}
                <header className="hidden sm:flex h-16 bg-white/70 backdrop-blur-md border-b border-slate-200 items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center max-w-md w-full">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search leads, contacts..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-700 placeholder-slate-400 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                        >
                            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                        </button>
                        <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 w-full max-w-[1600px] mx-auto fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
