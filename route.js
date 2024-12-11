import express from 'express';
import { loginHandler, registerHandler } from './controller';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.get('/register', registerHandler);

router.get('/login', loginHandler);

export { router };