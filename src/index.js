require('dotenv').config();
const express = require('express');
const moviesPerActorRouter = require('./routes/moviesPerActor');
const actorsWithMultipleCharactersRouter = require('./routes/actorsWithMultipleCharacters');
const charactersWithMultipleActorsRouter = require('./routes/charactersWithMultipleActors');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use('/moviesPerActor', moviesPerActorRouter);
app.use('/actorsWithMultipleCharacters', actorsWithMultipleCharactersRouter);
app.use('/charactersWithMultipleActors', charactersWithMultipleActorsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});