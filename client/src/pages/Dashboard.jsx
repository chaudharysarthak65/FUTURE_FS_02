import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Search, Plus, Eye, Edit2, Trash2, Loader2, ArrowUpRight, ArrowDownRight, Users, UserPlus, PhoneForwarded, CheckCircle, BarChart3, Filter, MoreHorizontal } from 'lucide-react';
import AddLeadModal from '../components/AddLeadModal';

const Dashboard = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/leads');
            setLeads(data);
        } catch (error) {
            toast.error('Failed to fetch leads');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this lead?')) {
            try {
                await api.delete(`/leads/${id}`);
                toast.success('Lead deleted successfully');
                fetchLeads();
            } catch (error) {
                toast.error('Failed to delete lead');
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'new':
                return <span className="px-3 py-1 flex w-fit items-center gap-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/50 rounded-full shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>New
                </span>;
            case 'contacted':
                return <span className="px-3 py-1 flex w-fit items-center gap-1.5 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/50 rounded-full shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Contacted
                </span>;
            case 'converted':
                return <span className="px-3 py-1 flex w-fit items-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50 rounded-full shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Converted
                </span>;
            default:
                return <span className="px-3 py-1 flex w-fit items-center gap-1.5 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/50 rounded-full shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>{status}
                </span>;
        }
    };

    const stats = [
        {
            key: 'total',
            label: 'Total Leads',
            value: leads.length,
            trend: '+12%',
            isPositive: true,
            icon: Users,
            color: 'bg-indigo-500',
            bg: 'bg-indigo-50',
            border: 'border-l-indigo-500'
        },
        {
            key: 'new',
            label: 'New Leads',
            value: leads.filter((l) => l.status === 'new').length,
            trend: '+5%',
            isPositive: true,
            icon: UserPlus,
            color: 'bg-blue-500',
            bg: 'bg-blue-50',
            border: 'border-l-blue-500'
        },
        {
            key: 'contacted',
            label: 'Contacted',
            value: leads.filter((l) => l.status === 'contacted').length,
            trend: '-2%',
            isPositive: false,
            icon: PhoneForwarded,
            color: 'bg-amber-500',
            bg: 'bg-amber-50',
            border: 'border-l-amber-500'
        },
        {
            key: 'converted',
            label: 'Converted',
            value: leads.filter((l) => l.status === 'converted').length,
            trend: '+18%',
            isPositive: true,
            icon: CheckCircle,
            color: 'bg-emerald-500',
            bg: 'bg-emerald-50',
            border: 'border-l-emerald-500'
        },
    ];

    const filteredLeads = leads.filter((lead) => {
        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || lead.status === filterStatus.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
                    <p className="text-[15px] text-slate-500 mt-1">Track and manage your lead pipeline efficiently.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 font-medium text-sm"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Lead
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={idx}
                            className={`glass-card rounded-2xl p-6 border-l-4 ${stat.border} relative overflow-hidden group`}
                        >
                            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br from-white/5 to-white/20 blur-xl group-hover:bg-slate-100/50 transition-colors"></div>

                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color.replace('bg-', 'text-')}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {stat.isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                                    {stat.trend}
                                </div>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Area */}
            <div className="bg-white/80 backdrop-blur-xl shadow-sm rounded-2xl border border-slate-200/60 overflow-hidden">
                {/* Table Header / Toolbar */}
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <BarChart3 className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">Recent Leads</h2>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search here..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 placeholder-slate-400 transition-all outline-none"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="appearance-none pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 outline-none transition-all cursor-pointer font-medium"
                            >
                                <option value="All">All Status</option>
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Converted">Converted</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="p-20 flex flex-col justify-center items-center">
                        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-4" />
                        <span className="text-slate-500 font-medium text-sm">Loading data...</span>
                    </div>
                ) : filteredLeads.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Search className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-1">No leads found</h3>
                        <p className="text-slate-500 text-sm max-w-sm">
                            {searchTerm || filterStatus !== 'All'
                                ? "We couldn't find anything matching your search criteria. Try adjusting your filters."
                                : "Your pipeline is currently empty. Add a new lead to get started."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 text-slate-500 sticky top-0 border-b border-slate-100">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Client Info</th>
                                    <th scope="col" className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Contact</th>
                                    <th scope="col" className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Status</th>
                                    <th scope="col" className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Source</th>
                                    <th scope="col" className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">Follow-Up</th>
                                    <th scope="col" className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {filteredLeads.map((lead) => (
                                    <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold text-sm shadow-sm border border-indigo-50">
                                                    {lead.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900">{lead.name}</div>
                                                    <div className="text-[13px] text-slate-500 mt-0.5">Added {new Date(lead.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-700">{lead.email}</div>
                                            <div className="text-[13px] text-slate-500 mt-0.5">{lead.phone || 'No phone'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(lead.status)}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium capitalize">
                                            {lead.source}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-700">
                                                {lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : <span className="text-slate-400 italic font-normal">Not Set</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    to={`/leads/${lead._id}`}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(lead._id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            {/* Fallback for touch screens */}
                                            <div className="group-hover:hidden text-slate-400">
                                                <MoreHorizontal className="h-5 w-5 ml-auto" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <AddLeadModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchLeads}
            />
        </div>
    );
};

export default Dashboard;
