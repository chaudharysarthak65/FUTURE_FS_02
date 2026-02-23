import Lead from '../models/Lead.js';

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req, res) => {
    try {
        const defaultSort = { createdAt: -1 };
        const leads = await Lead.find({}).sort(defaultSort);
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get lead by ID
// @route   GET /api/leads/:id
// @access  Private
export const getLeadById = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        res.json(lead);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req, res) => {
    try {
        const { name, email, phone, source, status, followUpDate } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        const lead = new Lead({
            name,
            email,
            phone,
            source,
            status,
            followUpDate
        });

        const createdLead = await lead.save();
        res.status(201).json(createdLead);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = async (req, res) => {
    try {
        const { name, email, phone, source, status, followUpDate } = req.body;

        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        lead.name = name || lead.name;
        lead.email = email || lead.email;
        lead.phone = phone !== undefined ? phone : lead.phone;
        lead.source = source || lead.source;
        lead.status = status || lead.status;
        if (followUpDate !== undefined) {
            lead.followUpDate = followUpDate;
        }

        const updatedLead = await lead.save();
        res.json(updatedLead);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
export const deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        await lead.deleteOne();
        res.json({ message: 'Lead removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Add a note to a lead
// @route   POST /api/leads/:id/notes
// @access  Private
export const addNoteToLead = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: 'Note text is required' });
        }

        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        const note = {
            text,
            date: Date.now()
        };

        lead.notes.push(note);
        await lead.save();

        res.status(201).json(lead);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
