"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/api/users/profile', (_req, res) => {
    res.json({ name: 'Demo User', email: 'demo@example.com' });
});
router.put('/api/users/profile', (_req, res) => {
    res.json({ message: 'Profile updated' });
});
exports.default = router;
