import axios from 'axios';

const spotifySearchEndpoint = 'https://api.spotify.com/v1/search';
const spotifyArtistsEndpoint = 'https://api.spotify.com/v1/artists';

const filterSpotifyArtistData = artist => {
    const { id, name, genres } = artist;
    const image_url = artist.images.length ? artist.images[0].url : null;
    const spotify_url = artist.external_urls.spotify;
    return { id, name, genres, image_url, spotify_url };
}

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
            const artists = response.data.artists.items.map(filterSpotifyArtistData);
            res.status(200).send(artists);
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
            res.status(200).send(filterSpotifyArtistData(response.data));
        }).catch(error => {
            res.status(500).send(error);
        });
    }
};

export default Artist;