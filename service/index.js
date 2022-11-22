const express = require('express');
const app = express();
const DB = require('./database.js');

// The service port. In production the application is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Server up the applications static content
app.use(express.static('application'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// GetScores
apiRouter.get('/scores', async (_req, res) => {
  const scores = await DB.getHighScores();
  res.send(scores);
});

// SubmitScore
apiRouter.post('/score', async (req, res) => {
  DB.addScore(req.body);
  const scores = await DB.getHighScores();
  res.send(scores);
});

// Redirect back to the home page if the path is unknown
app.use((_req, res) => {
  res.redirect(`/`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
