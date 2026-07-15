import { Router } from 'express';

const router = Router();

router.get('/api/books', (_req, res) => {
  res.json([{ id: '1', title: 'The Alchemist', author: 'Paulo Coelho', category: 'Novel', price: 320 }]);
});

router.post('/api/books', (_req, res) => {
  res.status(201).json({ message: 'Book listing created' });
});

router.get('/api/books/:id', (req, res) => {
  res.json({ id: req.params.id, title: 'Sample book', author: 'Sample author' });
});

router.put('/api/books/:id', (req, res) => {
  res.json({ message: `Book ${req.params.id} updated` });
});

router.delete('/api/books/:id', (req, res) => {
  res.json({ message: `Book ${req.params.id} deleted` });
});

export default router;
