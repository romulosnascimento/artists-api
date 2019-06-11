import dotenv from 'dotenv';
import axios from 'axios'

dotenv.config();

const spotifyConfig = {};
spotifyConfig.authorization = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

const Spotify = {
    handleAuthorization: (req, res, next) => {
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
}

export default Spotify;
