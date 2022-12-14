const express = require('express');
const querystring = require('node:querystring');


// const dotenv = require('dotenv');
// dotenv.config();

const spotifyApi = require('../utils/apiWrapper');
const authController = require('../controllers/authController');
const songsController = require('../controllers/songsController');




const router = express.Router();


// redirect to the Spotify authorization form for user authentication (i.e. sign-in)
router.get(
    '/auth',
    (req, res) => {
        res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
            client_id: process.env.CLIENT_ID,
            response_type: 'code',
            redirect_uri: process.env.REDIRECT_URI
        }))
    }
)

router.get(
    '/getToken',
    (req, res) => {
        // console.log('the request is: ', req);
        spotifyApi.authorizationCodeGrant(req.query.code)
        .then(data => {
            res.cookie('access', data.body.access_token).cookie('refresh', data.body.refresh_token);
            res.status(200).send("ended the api/getToken route!");
        })
    }
)

router.get(
    '/getSpotifyId',
    authController.getSpotifyId,
    (req, res) => {
        res.cookie('spotifyId', res.locals.spotifyId);
        res.status(200).send("ended the api/getSpotifyId route! beware that the musician's spotifyId is currently saved as a cookie, and probably shouldn't be.");
    }
)

// end the /getToken req/res cycle with a RES.REDIRECT to another route, say api/getSpotifyId
router.get('/musician/:name',songsController.getMusicianId,songsController.getSongs,(req, res) => {
    return res.status(200).json(res.locals.songs);
})



module.exports = router;