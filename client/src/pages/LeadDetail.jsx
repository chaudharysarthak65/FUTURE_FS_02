import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Edit2, Calendar, Phone, Mail, Globe, Clock, MessageSquare, Plus } from 'lucide-react';

const LeadDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState('');
    const [status, setStatus] = useState('');
    const [savingStatus, setSavingStatus] = useState(false);
    const [savingNote, setSavingNote] = useState(false);

    const fetchLead = async () => {
        try {
            const { data } = await api.get(`/leads/${id}`);
            setLead(data);
            setStatus(data.status);
        } catch (error) {
            toast.error('Failed to load lead details');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLead();
    }, [id]);

    const handleStatusChange = async (newStatus) => {
        setStatus(newStatus);
        setSavingStatus(true);
        try {
            await api.put(`/leads/${id}`, { status: newStatus });
            toast.success('Status updated');
            setLead({ ...lead, status: newStatus });
        } catch (error) {
            toast.error('Failed to update status');
            setStatus(lead.status);
        } finally {
            setSavingStatus(false);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        setSavingNote(true);
        try {
            const { data } = await api.post(`/leads/${id}/notes`, { text: newNote });
            setLead(data);
            setNewNote('');
            toast.success('Note added');
        } catch (error) {
            toast.error('Failed to add note');
        } finally {
            setSavingNote(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!lead) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Dashboard
                </button>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Update Status:</span>
                    <select
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={savingStatus}
                        className="block w-full pl-3 pr-10 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md bg-white font-medium disabled:opacity-50"
                    >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                    </select>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                {/* Profile Header */}
                <div className="bg-blue-50/50 px-6 py-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            Added on {new Date(lead.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <div className="flex gap-2 text-sm font-medium">
                        <span className={`px-3 py-1 bg-white rounded-full border shadow-sm ${lead.status === 'new' ? 'text-blue-700 border-blue-200' :
                                lead.status === 'contacted' ? 'text-yellow-700 border-yellow-200' :
                                    'text-green-700 border-green-200'
                            }`}>
                            Status: <span className="capitalize">{lead.status}</span>
                        </span>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Details</h3>
                        <div className="flex items-center text-gray-700">
                            <Mail className="h-5 w-5 mr-3 text-gray-400" />
                            <a href={`mailto:${lead.email}`} className="hover:text-blue-600 transition-colors">{lead.email}</a>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <Phone className="h-5 w-5 mr-3 text-gray-400" />
                            <a href={`tel:${lead.phone}`} className="hover:text-blue-600 transition-colors">{lead.phone || 'No phone provided'}</a>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Lead Information</h3>
                        <div className="flex items-center text-gray-700">
                            <Globe className="h-5 w-5 mr-3 text-gray-400" />
                            <span className="capitalize">Source: <span className="font-medium">{lead.source}</span></span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                            <span>Follow-up: <span className="font-medium">{lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : 'None scheduled'}</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notes Section */}
            <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden p-6 space-y-6">
                <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                        Activity Notes ({lead.notes?.length || 0})
                    </h3>
                </div>

                {/* Existing Notes */}
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {lead.notes && lead.notes.length > 0 ? (
                        lead.notes.slice().reverse().map((note, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4 font-sm text-gray-800 break-words border border-gray-100 relative">
                                <p className="mb-2">{note.text}</p>
                                <div className="span text-xs text-gray-400 flex justify-end">
                                    {new Date(note.date).toLocaleString()}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm py-4 text-center bg-gray-50 rounded-lg border border-dashed">No notes yet. Add one below!</p>
                    )}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="mt-6">
                    <label className="sr-only">Add a note</label>
                    <div className="flex items-start space-x-4">
                        <div className="min-w-0 flex-1">
                            <textarea
                                rows={3}
                                className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 resize-none"
                                placeholder="Write a note about this lead..."
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                            />
                        </div>
                        <div className="flex-shrink-0">
                            <button
                                type="submit"
                                disabled={savingNote || !newNote.trim()}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                            >
                                {savingNote ? 'Parsing...' : 'Add Note'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default LeadDetail;
