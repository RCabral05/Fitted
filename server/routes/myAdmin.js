import express from "express";
import Tags from '../models/Tags.js';

const router = express.Router();

//Add tags in MyAdmin
router.post('/api/tags', async (req, res) => {
    try {
        const { name } = req.body;
        const newTag = new Tags({ name });
        await newTag.save();
        res.status(201).json(newTag);
    } catch (error) {
        console.error('Error creating new tag:', error);
        res.status(500).json({ message: 'Failed to create new tag', error: error.toString() });
    }
});

// Edit a tag
router.put('/api/tags/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updatedTag = await Tags.findByIdAndUpdate(id, { name }, { new: true });
        if (!updatedTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        res.json(updatedTag);
    } catch (error) {
        console.error('Error updating tag:', error);
        res.status(500).json({ message: 'Failed to update tag', error: error.toString() });
    }
});

// Delete a tag
router.delete('/api/tags/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTag = await Tags.findByIdAndDelete(id);
        if (!deletedTag) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
        console.error('Error deleting tag:', error);
        res.status(500).json({ message: 'Failed to delete tag', error: error.toString() });
    }
});



export default router;
