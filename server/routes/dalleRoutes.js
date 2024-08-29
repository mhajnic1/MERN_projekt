import express from 'express';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';
import axios from 'axios';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.route('/').get((req, res) => {
    res.send('Diamond is unbreakable');
});

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;

        const aiResponse = await openai.images.generate({
            model:"dall-e-3",
            prompt,
            size: '1024x1024',
            quality:"standard",
            n:1,
        });

        const image = aiResponse.data[0].url;
        
        res.status(200).json({ photo: image });
    } catch (error) {
        console.error(error);
        const errorMessage = error?.response?.data?.error?.message || "Something went wrong!";
        res.status(500).send(errorMessage);
    }
});

export default router;
