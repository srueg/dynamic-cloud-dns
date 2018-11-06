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

To be able to authenticate against the Google Cloud DNS API, a environemnt variable `GOOGLE_APPLICATION_CREDENTIALS` must be set, which point to a valid [credentials.json](https://developers.google.com/identity/protocols/application-default-credentials). The Google Cloud project name is read from the env var `GCLOUD_PROJECT`.

## Local Development
* `nvm use`
* `npm install -g @google-cloud/functions-emulator`
* `functions start`
* For debugging `functions inspect updateHost`

## Deploy to Google Cloud Functions
* Setup [Google Cloud Functions](https://cloud.google.com/functions/docs/quickstart)
* `gcloud beta functions deploy updateHost --stage-bucket <bucket-name> --trigger-http`

## License ##

Copyright (c) 2017, Simon Rüegg. All rights reserved.

Smith is licensed under the MIT License.

See [LICENSE](LICENSE) for more details.
