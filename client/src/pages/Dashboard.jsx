import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Search, Plus, Eye, Edit2, Trash2, Loader2, ArrowUpRight } from 'lucide-react';
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
                return <span className="px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">New</span>;
            case 'contacted':
                return <span className="px-2.5 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Contacted</span>;
            case 'converted':
                return <span className="px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Converted</span>;
            default:
                return <span className="px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">{status}</span>;
        }
    };

    const stats = {
        total: leads.length,
        new: leads.filter((l) => l.status === 'new').length,
        contacted: leads.filter((l) => l.status === 'contacted').length,
        converted: leads.filter((l) => l.status === 'converted').length,
    };

    const filteredLeads = leads.filter((lead) => {
        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || lead.status === filterStatus.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Leads Overview</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and track your client conversions</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Lead
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {Object.entries(stats).map(([key, value]) => (
                    <div key={key} className="bg-white overflow-hidden shadow-sm rounded-xl py-5 px-6 border border-gray-100 flex items-center justify-between">
                        <div>
                            <dt className="text-sm font-medium text-gray-500 truncate capitalize">
                                {key} Leads
                            </dt>
                            <dd className="mt-2 text-3xl font-extrabold text-gray-900">
                                {value}
                            </dd>
                        </div>
                        <div className={`p-3 rounded-full ${key === 'new' ? 'bg-blue-50 text-blue-600' : key === 'contacted' ? 'bg-yellow-50 text-yellow-600' : key === 'converted' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'}`}>
                            <ArrowUpRight className="h-6 w-6" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search leads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 text-gray-900"
                    />
                </div>
                <div className="flex-shrink-0">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-gray-50 text-gray-900"
                    >
                        <option value="All">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Converted</option>
                    </select>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center items-center">
                        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                        <span className="ml-3 text-gray-500 font-medium tracking-wide">Loading leads...</span>
                    </div>
                ) : filteredLeads.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        {searchTerm || filterStatus !== 'All' ? 'No leads match your search criteria.' : 'No leads found. Add one to get started!'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lead</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Follow-Up</th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredLeads.map((lead) => (
                                    <tr key={lead._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">Added {new Date(lead.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{lead.email}</div>
                                            <div className="text-sm text-gray-500">{lead.phone || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(lead.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {lead.source}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : 'Not Set'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-3">
                                                <Link to={`/leads/${lead._id}`} className="text-gray-400 hover:text-blue-600 transition-colors" title="View Details">
                                                    <Eye className="h-5 w-5" />
                                                </Link>
                                                <button onClick={() => handleDelete(lead._id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
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
