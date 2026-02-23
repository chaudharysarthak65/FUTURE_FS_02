import { useState } from 'react';
import { X, UserPlus, Mail, Phone, Globe, Calendar, CheckCircle, RefreshCcw, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const AddLeadModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        source: 'Website',
        status: 'new',
        followUpDate: ''
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/leads', formData);
            toast.success('Lead added successfully!');
            onSuccess();
            onClose();
            setFormData({
                name: '', email: '', phone: '', source: 'Website', status: 'new', followUpDate: ''
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add lead');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                />

                {/* Modal Panel */}
                <div className="relative inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle w-full max-w-[500px] animate-in zoom-in-95 duration-200">

                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <UserPlus className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Add New Lead</h3>
                                <p className="text-[13px] text-slate-500">Enter client details to create a new record.</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-full transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Form Body */}
                    <div className="px-6 py-6 pb-8 bg-slate-50/50">
                        <form id="add-lead-form" onSubmit={handleSubmit} className="space-y-5">
                            {/* Name Input */}
                            <div>
                                <label className="block text[13px] font-semibold text-slate-700 mb-1.5 ml-1">Full Name *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserPlus className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="pl-10 block w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm placeholder:text-slate-400"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            {/* Email & Phone */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5 ml-1">Email Address *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="pl-10 block w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm placeholder:text-slate-400"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5 ml-1">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="pl-10 block w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm placeholder:text-slate-400"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Source & Status */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5 ml-1">Source</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Globe className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <select
                                            name="source"
                                            value={formData.source}
                                            onChange={handleChange}
                                            className="pl-10 appearance-none block w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm text-slate-700"
                                        >
                                            <option value="Website">Website</option>
                                            <option value="Instagram">Instagram</option>
                                            <option value="Referral">Referral</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5 ml-1">Initial Status</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            {formData.status === 'new' && <CheckCircle className="h-4 w-4 text-indigo-500" />}
                                            {formData.status === 'contacted' && <RefreshCcw className="h-4 w-4 text-amber-500" />}
                                            {formData.status === 'converted' && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                                        </div>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="pl-10 appearance-none block w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm text-slate-700"
                                        >
                                            <option value="new">New Lead</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="converted">Converted</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Follow-up Date */}
                            <div>
                                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5 ml-1">Follow-up Date</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="date"
                                        name="followUpDate"
                                        value={formData.followUpDate}
                                        onChange={handleChange}
                                        className="pl-10 block w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm text-slate-700"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 py-4 border-t border-slate-100 bg-white flex flex-col-reverse sm:flex-row gap-3 justify-end items-center">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="add-lead-form"
                            disabled={loading}
                            className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center min-w-[120px]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Create Lead'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddLeadModal;
