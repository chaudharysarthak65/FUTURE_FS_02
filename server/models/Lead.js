import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    source: {
        type: String,
        enum: ['Website', 'Instagram', 'Referral', 'Other'],
        default: 'Other',
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'converted'],
        default: 'new',
    },
    notes: [noteSchema],
    followUpDate: {
        type: Date,
    }
}, { timestamps: true });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
