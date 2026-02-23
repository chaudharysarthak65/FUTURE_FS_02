import express from 'express';
import { getLeads, getLeadById, createLead, updateLead, deleteLead, addNoteToLead } from '../controllers/leadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getLeads)
    .post(protect, createLead);

router.route('/:id')
    .get(protect, getLeadById)
    .put(protect, updateLead)
    .delete(protect, deleteLead);

router.post('/:id/notes', protect, addNoteToLead);

export default router;
