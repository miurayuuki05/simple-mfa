import express from 'express';
const app = express();
import { loginHandler, registerHandler, verifyOTPHandler } from './controller.js';

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/register', registerHandler);

app.post('/login', loginHandler);

app.post('/verify', verifyOTPHandler);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});