import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Lead from './models/Lead.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Lead.deleteMany();

        const adminUser = new User({
            email: 'admin@crm.com',
            password: 'password123',
        });

        await adminUser.save();

        const dummyLeads = [
            {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '123-456-7890',
                source: 'Website',
                status: 'new',
                notes: [{ text: 'Expressed interest in premium package', date: new Date() }],
                followUpDate: new Date(new Date().setDate(new Date().getDate() + 2))
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                phone: '098-765-4321',
                source: 'Instagram',
                status: 'contacted',
                notes: [{ text: 'Sent pricing information via DM', date: new Date() }],
                followUpDate: new Date(new Date().setDate(new Date().getDate() + 1))
            },
            {
                name: 'Acme Corp',
                email: 'contact@acme.inc',
                phone: '555-019-2029',
                source: 'Referral',
                status: 'converted',
                notes: [{ text: 'Signed contract on Monday', date: new Date() }],
            }
        ];

        await Lead.insertMany(dummyLeads);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error with data import: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Lead.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error with data destruction: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
