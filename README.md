# Dynamic Cloud DNS

Dynamic DNS functionality backed by Google Cloud DNS hosted on Google Cloud Functions.
The deployed function can be called with the host, IPv4 and IPv6 address to update. The data can be either URL query parameters or a JSON body.
```
curl https://us-central1-<project-name>.cloudfunctions.net/updateHost?token=<secretToken>&host=test.example.com&ipv4=192.168.1.1&ipv6=::1
```
```
curl https://us-central1-<project-name>.cloudfunctions.net/updateHost \
    -d '{ \
            token: "<secretToken>" \
            host: "test.example.com" \
            ipv4: "192.168.1.1" \
            ipv6: "::1" \
        }'
```
If neither an IPv4 nor an IPv6 address is provided, the source address of the request is used.

## Configuration

Settings are stored in `settings.json`

| Config     | Description
|------------|---------------
|`dnsZone`     | The Google Cloud DNS Zone name in which the records reside.
|`secretToken` | A secret token, used to authenticate users.
|`ttl`         | Time to live for records in seconds.

To be able to authenticate against the Google Cloud DNS API, an environment variable `GOOGLE_APPLICATION_CREDENTIALS` must be set, which points to a valid [credentials.json](https://cloud.google.com/docs/authentication/production). The Google Cloud project name is read from the env var `GCLOUD_PROJECT`.

## Local Development

* `nvm use`
* `npm install`
* Setup your Gcloud credentials: `export GOOGLE_APPLICATION_CREDENTIALS=/Path/to/your/credentials.json`
* To start the emulator in the background: `npm start &`
* Send requests to the emulator: `curl localhost:8080?token=<secretToken>&host=test.example.com&ipv4=192.168.1.1&ipv6=::1`

See [docs](https://github.com/GoogleCloudPlatform/functions-framework-nodejs) for further info.

## Deploy to Google Cloud Functions

* Setup [Google Cloud Functions](https://cloud.google.com/functions/docs/quickstart)
* [Install](https://cloud.google.com/sdk/install) the `gcloud` CLI tool
* Authenticate: `gcloud auth login`
* `npm run deploy`

## Client

If you want to call this automatically under Linux, you can try [Dynamic Cloud DNS Client](https://github.com/crazystick/dynamic-cloud-dns-client)

## License

Copyright (c) 2020, Simon Rüegg. All rights reserved.

Dynamic Cloud DNS is licensed under the MIT License.

See [LICENSE](LICENSE) for more details.
