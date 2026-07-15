import { Router } from 'express';
const router = Router();
router.post('/api/auth/google', (_req, res) => {
    res.json({ message: 'Google auth endpoint ready' });
});
router.post('/api/auth/email/send-otp', (_req, res) => {
    res.json({ message: 'OTP sent to email' });
});
router.post('/api/auth/email/verify-otp', (_req, res) => {
    res.json({ message: 'OTP verified', token: 'demo-jwt-token' });
});
router.post('/api/auth/mobile/send-otp', (_req, res) => {
    res.json({ message: 'OTP sent to phone' });
});
router.post('/api/auth/mobile/verify-otp', (_req, res) => {
    res.json({ message: 'Phone OTP verified', token: 'demo-jwt-token' });
});
export default router;
