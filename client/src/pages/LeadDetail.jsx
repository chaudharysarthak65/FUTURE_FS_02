import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Calendar, Phone, Mail, Globe, Clock, MessageSquare, Send, User, ChevronDown, CheckCircle, RefreshCcw, Loader2 } from 'lucide-react';

const LeadDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState('');
    const [status, setStatus] = useState('');
    const [savingStatus, setSavingStatus] = useState(false);
    const [savingNote, setSavingNote] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

    const notesEndRef = useRef(null);

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

    useEffect(() => {
        // Auto scroll to bottom of notes when new note is added
        notesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [lead?.notes]);

    const handleStatusChange = async (newStatus) => {
        setStatus(newStatus);
        setIsStatusDropdownOpen(false);
        setSavingStatus(true);
        try {
            await api.put(`/leads/${id}`, { status: newStatus });
            toast.success('Status updated successfully');
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
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="animate-spin text-indigo-600 h-10 w-10" />
            </div>
        );
    }

    if (!lead) return null;

    const statusOptions = [
        { value: 'new', label: 'New Lead', icon: CheckCircle, color: 'text-indigo-600', bg: 'bg-indigo-50', dot: 'bg-indigo-500' },
        { value: 'contacted', label: 'Contacted', icon: RefreshCcw, color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500' },
        { value: 'converted', label: 'Converted', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
    ];

    const currentStatusOption = statusOptions.find(opt => opt.value === status) || statusOptions[0];

    return (
        <div className="max-w-[1400px] mx-auto h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
            {/* Header bar */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-200/60 mb-6 shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{lead.name}</h1>
                        <p className="text-[13px] text-slate-500 mt-0.5">Added on {new Date(lead.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                        disabled={savingStatus}
                        className={`flex items-center gap-2.5 px-4 py-2.5 ${currentStatusOption.bg} ${currentStatusOption.color} border border-white/20 shadow-sm rounded-xl font-medium text-sm transition-all hover:shadow-md disabled:opacity-70`}
                    >
                        {savingStatus ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <span className={`w-2 h-2 rounded-full ${currentStatusOption.dot}`}></span>
                        )}
                        {currentStatusOption.label}
                        <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
                    </button>

                    {isStatusDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-xl rounded-2xl overflow-hidden z-50 animate-in slide-in-from-top-2">
                            <div className="p-1.5 space-y-1">
                                {statusOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => handleStatusChange(opt.value)}
                                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${status === opt.value ? 'bg-slate-50 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${opt.dot}`}></span>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Split Panel Layout */}
            <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">

                {/* Left Panel: Client Info */}
                <div className="lg:w-[400px] shrink-0 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 pb-6">
                    {/* Primary Info Card */}
                    <div className="glass-card rounded-2xl p-6 border border-slate-200/60">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-indigo-700 font-bold text-xl shadow-inner border border-white/50">
                                {lead.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">{lead.name}</h2>
                                <span className="text-[13px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{lead.source}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-50 rounded-xl text-slate-400 shrink-0 mt-0.5">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Email Address</p>
                                    <a href={`mailto:${lead.email}`} className="text-sm font-medium text-slate-700 hover:text-indigo-600 truncate block transition-colors">{lead.email}</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-50 rounded-xl text-slate-400 shrink-0 mt-0.5">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Phone Number</p>
                                    <a href={`tel:${lead.phone}`} className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">{lead.phone || 'Not provided'}</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Info Card */}
                    <div className="glass-card rounded-2xl p-6 border border-slate-200/60">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            Key Dates
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 last:pb-0">
                                <span className="text-sm text-slate-500">Created</span>
                                <span className="text-sm font-medium text-slate-900">{new Date(lead.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 last:pb-0">
                                <span className="text-sm text-slate-500">Follow-up</span>
                                <span className={`text-sm font-medium ${lead.followUpDate ? 'text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md' : 'text-slate-400 italic'}`}>
                                    {lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : 'Unscheduled'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Notes / Activity Thread */}
                <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden min-h-0">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-slate-200/60 bg-white/50 shrink-0 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-indigo-500" />
                            <h3 className="text-[15px] font-bold text-slate-900">Activity Thread</h3>
                        </div>
                        <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">
                            {lead.notes?.length || 0} notes
                        </span>
                    </div>

                    {/* Timeline Feed */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                        {lead.notes && lead.notes.length > 0 ? (
                            lead.notes.map((note, index) => (
                                <div key={index} className="flex gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/50 relative z-10">
                                        <User className="h-5 w-5 text-slate-400" />
                                        {/* Activity Line */}
                                        {index !== lead.notes.length - 1 && (
                                            <div className="absolute top-10 bottom-[-24px] w-px bg-slate-200 left-1/2 -translate-x-1/2"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 bg-white p-4 rounded-2xl rounded-tl-sm border border-slate-200/50 shadow-sm group-hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-1.5">
                                            <span className="text-[13px] font-semibold text-slate-900">Admin</span>
                                            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(note.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                            </span>
                                        </div>
                                        <p className="text-[14px] text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{note.text}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 transform -rotate-6">
                                    <MessageSquare className="h-8 w-8 text-slate-300" />
                                </div>
                                <p className="text-sm font-medium">No activity recorded yet.</p>
                                <p className="text-[13px] text-slate-400 mt-1">Start the conversation below.</p>
                            </div>
                        )}
                        <div ref={notesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-slate-50 border-t border-slate-200/60 shrink-0">
                        <form onSubmit={handleAddNote} className="relative">
                            <textarea
                                rows={2}
                                className="w-full bg-white border border-slate-200/80 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 pl-4 pr-16 py-3 text-sm text-slate-700 placeholder:text-slate-400 resize-none transition-all custom-scrollbar"
                                placeholder="Log an activity or drop a note..."
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAddNote(e);
                                    }
                                }}
                            />
                            <button
                                type="submit"
                                disabled={savingNote || !newNote.trim()}
                                className="absolute right-2 bottom-2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-300 transition-all shadow-sm"
                            >
                                {savingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                        </form>
                        <p className="text-[11px] text-slate-400 mt-2 ml-1 flex justify-between">
                            <span><strong>Pro tip:</strong> Press <kbd className="px-1.5 border border-slate-200 rounded font-sans mx-0.5 shadow-sm text-slate-500">Enter</kbd> to submit</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadDetail;
