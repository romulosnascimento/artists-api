import express from 'express';
import dotenv from 'dotenv';
import swagger from 'swagger-ui-express';

import Spotify from './src/services/Spotify';
import Artist from './src/controllers/Artist';

import swaggerDoc from './swagger.json';

const app = express();
app.use(express.json());
app.use('/api-docs', swagger.serve, swagger.setup(swaggerDoc));

dotenv.config();

app.get('/api/v1/artists', Spotify.handleAuthorization, Artist.search);
app.get('/api/v1/artists/:id', Spotify.handleAuthorization, Artist.get);

app.listen(process.env.PORT, () => {
    console.log('App running on port ', process.env.PORT);
});