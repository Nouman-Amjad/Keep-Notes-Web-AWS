const express = require('express');
const bodyParser = require('body-parser');
// Import your handler functions
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
} = require('./handler');

const app = express();
app.use(bodyParser.json());

// Map REST routes to your Lambda-like handlers
app.post('/notes', async (req, res, next) => {
  try { res.json(await createNote(req.body)); }
  catch (e) { next(e); }
});

app.get('/notes', async (req, res, next) => {
  try { res.json(await getNotes()); }
  catch (e) { next(e); }
});

app.get('/notes/:id', async (req, res, next) => {
  try { res.json(await getNoteById(req.params.id)); }
  catch (e) { next(e); }
});

app.put('/notes/:id', async (req, res, next) => {
  try { res.json(await updateNote(req.params.id, req.body)); }
  catch (e) { next(e); }
});

app.delete('/notes/:id', async (req, res, next) => {
  try { res.json(await deleteNote(req.params.id)); }
  catch (e) { next(e); }
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Notes API listening on port ${PORT}`);
});
