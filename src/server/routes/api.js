const express = require('express');
const querystring = require('node:querystring');

const query = require('../models/models');

const spotifyApi = require('../utils/apiWrapper');
const authController = require('../controllers/authController');
const { nextTick } = require('node:process');




const router = express.Router();


// redirect the musician to the Spotify auth page.
// after the musician finishes there, they are redirected to localhost:8080/api/getMusicianInfo (handled just below).
    // if their Spotify login was successful, that redirect comes with a 'code' (a long string) stored as req.query.code .
    // if the Spotify login was unsuccessful, that redirect comes with an error message.
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

// this endpoint receives redirects from the Spotify auth page, which come equipped with a 'code' (a long string) stored as req.query.code . given that, this route handler says:
    // using the code, go back to the Spotify API to get access and refresh tokens. save them as cookies and also on res.locals .
    // using the access token, go back to the Spotify API again and get the musician's spotify id.
    // then, go to the SQL database and get the musician info corresponding to that spotify id (if it exists).
router.get(
    '/getMusicianInfo',
    authController.getTokens,
    authController.getSpotifyId,
    authController.getMusicianInfoFromDb,
    (req, res) => {
        const myString = JSON.stringify(res.locals.musicianInfo) || 'musician not found in database';
        return res.status(200).send(myString);
    }
)


module.exports = router;