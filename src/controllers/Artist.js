import axios from 'axios';

const spotifySearchEndpoint = 'https://api.spotify.com/v1/search';
const spotifyArtistsEndpoint = 'https://api.spotify.com/v1/artists';

const Artist = {
    search: (req, res) => {
        const searchQuery = req.query.q;
        const page = req.query.page || 0;
        const size = req.query.size || 10;
        axios.get(`${spotifySearchEndpoint}?query=${searchQuery}&type=artist&offset=${page}&limit=${size}`, {
            headers: {
                'Authorization': `${req.spotifyToken.token_type} ${req.spotifyToken.access_token}`
            }
        }).then(response => {
            res.status(200).send(response.data);
        }).catch(error => {
            res.status(500).send(error);
        });
    },
    get: (req, res) => {
        const id = req.params.id;
        axios.get(`${spotifyArtistsEndpoint}/${id}`, {
            headers: {
                'Authorization': `${req.spotifyToken.token_type} ${req.spotifyToken.access_token}`
            }
        }).then(response => {
            res.status(200).send(response.data);
        }).catch(error => {
            res.status(500).send(error);
        });
    }
};

export default Artist;