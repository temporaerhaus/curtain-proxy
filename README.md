# Curtain Proxy 🙈🪟

A very simple and janky HTTP proxy that allows regex-based edits on the content to filter out or hide some stuff.

## Configuration
Curtain can be fully configured using environment variables.

### `CURTAIN_URL_<LABEL>`
The URL that will be proxied.
Further configuration is provided using the other environment variables, as long as the same `<LABEL>` is used.

### `CURTAIN_PATH_<LABEL>`
The path on which the proxied URL will be served.

### `CURTAIN_REGEX_<LABEL>_<NAME>`
Allows to specify an sed-like regular expression to modify the proxy's response before returning it to the client.
You can use more than regex rule for a single proxied resource, by setting different a `<NAME>` per rule.
Each rule is applied in lexicographic order sorted by `<NAME>`.

## Example
The following example shows a configuration for redacting an ical feed of a private calendar:

```
CURTAIN_URL_PRIVATE='https://example.com/calendar.ics?export'
CURTAIN_PATH_PRIVATE='/redacted.ics'
CURTAIN_REGEX_PRIVATE_SUMMARY='/^SUMMARY:[^\n]*(\n [^\n]*)*$/SUMMARY:/gm'
CURTAIN_REGEX_PRIVATE_LOCATION='/^LOCATION:[^\n]*(\n [^\n]*)*$/LOCATION:/gm'
CURTAIN_REGEX_PRIVATE_DESCRIPTION='/^DESCRIPTION:[^\n]*(\n [^\n]*)*$/DESCRIPTION:/gm'
CURTAIN_REGEX_PRIVATE_OTHER='/^X-[^\n]*(\n [^\n]*)*\n//gm'
```

## License
MIT
