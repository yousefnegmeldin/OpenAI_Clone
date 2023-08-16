import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.route('/').get((req,res) => {
    res.send('hello from server!')
})



export default router;