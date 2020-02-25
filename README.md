# Telemetry Server

Small centralized server that exposes two endpoints. One that allows clients to retrieve the latest releases from GitHub, the other that allows clients to send anonymous metrics used to calculate Directus install count.

## Installation

Clone this repo and install the `npm` dependencies by running

```bash
$ npm install
```

## Usage

Duplicate the `.env.example` to `.env` and add the values.

Run the application by running `npm start`

## Reference

### Versions

Directus app and API versions are being pulled from GH releases on server start and after 2 days of "stale" versions.

```http
GET /versions
```

**Returns**  
```js
[
  {
    "version": String,     // eg v7.0.0
    "date": String,        // ISO Date String eg 2018-08-22T22:08:54Z
    "info": String,        // Markdown of GH Release
    "repo": String         // api || app
  }
]
```

### Count

```http
POST /count
```

**Request body**  
```json
{
    "version": "v7.0.0-rc.2",
    "url": "https://demo-api.directus.app",
    "type": "app"
}
```

(`type` is either `app` or `api`)

The URLs are stored in the database as a SHA256 hash.
