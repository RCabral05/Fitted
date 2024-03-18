import express from "express";
import Tags from '../models/Tags.js';
import AWS from 'aws-sdk';

const router = express.Router();

const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
    // region: process.env.AWS_REGION,
});

router.get('/api/files', async (req, res) => {
    const storeId = req.query.storeId;

    if (!storeId) {
        return res.status(400).send('storeId query parameter is required');
    }

    const params = {
        Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
        Prefix: `${storeId}/images/`, // List objects within storeId/images/
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        
        // Define the files after fetching the data from S3
        const files = data.Contents.map(file => {
            return { key: file.Key, url: `https://${params.Bucket}.s3.amazonaws.com/${file.Key}` };
        });

        // Now it's safe to log the files variable
        console.log('Files:', files);

        res.json(files);
    } catch (err) {
        console.error('S3 Error:', err);
        res.status(500).send('Error fetching files from S3');
    }
});



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
