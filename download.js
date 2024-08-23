require('dotenv').config();

const axios = require('axios');
const { exec } = require('youtube-dl-exec');
const fs = require('fs');
const { performance } = require('perf_hooks');

let pLimit;
(async () => {
    pLimit = (await import('p-limit')).default;

    // Spotify credentials
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
            const startTime = performance.now();
            exec(`ytsearch1:${query}`, {
                output: `${outputDirectory}/${track.name}.mp3`,
                extractAudio: true,
                audioFormat: 'mp3',
            }).then(output => {
                console.log(`Download complete: ${query}`);
                resolve();
            }).catch(err => {
                console.error(err);
                reject(err);
            });
        });
    }


    // Limit to 10 downloads at a time
    const limit = pLimit(10);

    async function downloadTracks(tracks) {
        const downloadPromises = tracks.map(track => limit(() => downloadTrack(track)));
        await Promise.all(downloadPromises);
    }

    (async () => {
        const playlistId = process.argv[2];
        if (!playlistId) {
            console.error('Please provide a playlist_id as a command-line argument.');
            process.exit(1);
        }

        const totalStartTime = performance.now();

        try {
            const tracks = await getPlaylistTracks(playlistId);

            await downloadTracks(tracks);

            const totalEndTime = performance.now();
            const totalDuration = ((totalEndTime - totalStartTime) / 60000).toFixed(2);
            console.log(`All ${tracks.length} tracks downloaded!`);
            console.log(`Total time taken: ${totalDuration} minutes`);
        } catch (error) {
            console.error('Error:', error);
        }
    })();
})();
