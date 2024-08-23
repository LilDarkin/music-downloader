# Spotify Playlist Downloader

This Node.js script downloads all tracks from a specified Spotify playlist and converts them to MP3 format using `youtube-dl-exec`. It tracks and logs the download time for each track as well as the total time for all downloads.

## Prerequisites

- Node.js (includes npm)
- Spotify Developer Account (for Client ID and Secret)

## Setup

1. **Clone or Download the Repository**

   Clone this repository or download the script to your local machine.

   ```bash
   git clone <repository_url>
   cd <repository_directory>
2. **Install Dependencies**

Install the required Node.js packages:

```bash
npm install axios youtube-dl-exec dotenv
```

3. **Create a .env File**

Create a file named .env in the root of your project directory with the following content:

```bash
CLIENT_ID=your_spotify_client_id
CLIENT_SECRET=your_spotify_client_secret
```
Replace your_spotify_client_id and your_spotify_client_secret with your actual Spotify credentials.

## Usage
Run the script using Node.js and provide the Spotify playlist ID as a command-line argument:

```bash
node script.js <playlist_id>
```
Replace <playlist_id> with the actual ID of the Spotify playlist you want to download.

## Example
```bash
node script.js 37i9dQZF1E4v61pQ437NEg?si=bb49205ec3734b6a
```
This command will download all tracks from the playlist with the ID `37i9dQZF1E4v61pQ437NEg?si=bb49205ec3734b6a` and save them in MP3 format in the ./musics directory.

## Script Details
- Environment Variables: The script uses dotenv to load Spotify credentials from the .env file.
- Performance Tracking: Tracks the time taken for each download and the total time for all downloads.
- Directory Handling: Creates a ./musics directory if it does not exist to store downloaded MP3 files.

## Notes
- Ensure you have a valid Spotify Developer account and that your credentials are correctly set in the .env file.
- The script uses youtube-dl (via youtube-dl-exec) for searching and downloading tracks. Make sure you have youtube-dl installed on your system.

## Troubleshooting
- Error Handling: If you encounter errors, check the error messages in the console. Common issues include incorrect playlist IDs or invalid Spotify credentials.
- Network Issues: Ensure you have a stable internet connection for downloading tracks.
