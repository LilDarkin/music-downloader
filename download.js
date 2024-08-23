require('dotenv').config();

const axios = require('axios');
const { exec } = require('youtube-dl-exec');
const fs = require('fs');
const { performance } = require('perf_hooks'); // Import performance API

// Replace with your Spotify credentials
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

async function getAccessToken() {
    const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
    });
    return response.data.access_token;
}

async function getPlaylistTracks(playlistId) {
    const accessToken = await getAccessToken();
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    const tracks = response.data.tracks.items.map(item => ({
        name: item.track.name,
        artist: item.track.artists.map(artist => artist.name).join(', '),
    }));

    return tracks;
}

function downloadTrack(track) {
    const query = `${track.name} ${track.artist}`;
    console.log(`Downloading: ${query}`);

    const outputDirectory = './musics';
    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory);
    }

    return new Promise((resolve, reject) => {
        const startTime = performance.now(); // Record start time
        exec(`ytsearch1:${query}`, {
            output: `${outputDirectory}/${track.name}.mp3`,
            extractAudio: true,
            audioFormat: 'mp3',
        }).then(output => {
            const endTime = performance.now(); // Record end time
            const duration = ((endTime - startTime) / 1000).toFixed(2); // Duration in seconds
            console.log(`Download complete: ${query}`);
            console.log(`Time taken: ${duration} seconds`);
            resolve();
        }).catch(err => {
            console.error(err);
            reject(err);
        });
    });
}

(async () => {
    const playlistId = process.argv[2]; // Get playlist_id from command-line argument
    if (!playlistId) {
        console.error('Please provide a playlist_id as a command-line argument.');
        process.exit(1);
    }

    const totalStartTime = performance.now(); // Record total start time

    try {
        const tracks = await getPlaylistTracks(playlistId);

        for (const track of tracks) {
            await downloadTrack(track); // Download one by one
        }

        const totalEndTime = performance.now(); // Record total end time
        const totalDuration = ((totalEndTime - totalStartTime) / 1000).toFixed(2); // Total duration in seconds
        console.log('All tracks downloaded!');
        console.log(`Total time taken: ${totalDuration} seconds`);
    } catch (error) {
        console.error('Error:', error);
    }
})();
