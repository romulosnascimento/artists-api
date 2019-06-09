import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

import Artist from './src/controllers/Artist';

const app = express();
app.use(express.json());

dotenv.config();

const spotifyConfig = {};
spotifyConfig.authorization = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

const handleSpotifyAuthorization = (req, res, next) => {
    if (spotifyConfig.token) {
        req.spotifyToken = spotifyConfig.token;
        next();
    } else {
        const body = 'grant_type=client_credentials';
        const config = {
            headers: {
                'Authorization': `Basic ${spotifyConfig.authorization}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        axios.post('https://accounts.spotify.com/api/token', body, config)
            .then(response => {
                spotifyConfig.token = response.data;
                req.spotifyToken = spotifyConfig.token;
                next();
            })
            .catch(error => res.status(500).send(error));
    }
}

app.get('/api/v1/artists', handleSpotifyAuthorization, Artist.search);
app.get('/api/v1/artists/:id', handleSpotifyAuthorization, Artist.get);

app.listen(process.env.PORT, () => {
    console.log('App running on port ', process.env.PORT);
});