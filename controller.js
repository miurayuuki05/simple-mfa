import {auth, db} from './config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { Resend } from 'resend';
import 'dotenv/config';

const resend = new Resend(process.env.RESEND);


const loginHandler = async (req, res) => {
    const generatePin = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    const pin = generatePin();
    try {
        const userCredential = await signInWithEmailAndPassword(auth, req.body.email, req.body.password);
        const user = userCredential.user;

        const docRef = doc(db, "users", req.body.email);
        await setDoc(docRef, { otp: pin });

        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: ['delivered@resend.dev'],
            subject: 'OTP',
            text: `Your OTP is ${pin}`,
        });

        res.send(
            {
                user,
                pin
            }
        );
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const registerHandler = async (req, res) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, req.body.email, req.body.password);
        const user = userCredential.user;
        res.send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const verifyOTPHandler = async (req, res) => {
    const otpInput = req.body.otp;

    const docRef = doc(db, "users", req.body.email);
    const docSnap = await getDoc(docRef);
    const otp = docSnap.data().otp;
    
    if (otpInput === otp) {
        res.send('OTP is correct');
    } else {
        res.status(400).send('OTP is incorrect');
    }
}
        

export { loginHandler, registerHandler, verifyOTPHandler };