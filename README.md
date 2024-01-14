# Instagram Data API

## Overview
The `instagram-data-api` is an Express API that retrieves public user data from Instagram profiles. It uses the `axios` library to make HTTP requests and `cheerio` for parsing HTML responses.

## Installation
To use this API, you need to have Node.js installed on your machine. Then, clone this repository and install the dependencies:

```bash
npm i
```

## Usage
Start the server by running:

```bash
node index.js
```

The server will start on port 3000. To fetch data for an Instagram user, send a GET request to:

```
http://localhost:3000/:username
```

Replace `:username` with the actual Instagram username.

## Response Format
The API returns a JSON object containing the user's followers, following, and post counts. Here is a sample response:

```json
{
  "username": "icc",
  "followers": 30000000,
  "followers_text": "30M",
  "following": 238,
  "following_text": "238",
  "posts": 44000,
  "posts_text": "44K"
}
```

## Error Handling
If an error occurs while fetching the data, the API will respond with a status code of 500 and an error message.
