import { Router } from 'express';
const router = Router();
router.get('/api/users/profile', (_req, res) => {
    res.json({ name: 'Demo User', email: 'demo@example.com' });
});
router.put('/api/users/profile', (_req, res) => {
    res.json({ message: 'Profile updated' });
});
export default router;
