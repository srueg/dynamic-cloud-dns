# Dynamic Cloud DNS

Dynamic DNS functionality backed by Cloud DNS.

## Development
* `npm install -g @google-cloud/functions-emulator`
* `functions start`
* `functions inspect updateHost`

## Deploy
* `gcloud beta functions deploy updateHost --stage-bucket dynamic-cloud-dns --trigger-http`
