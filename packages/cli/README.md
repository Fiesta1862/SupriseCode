# SupriseCode CLI

Requires Node.js 22+ or Bun 1.1+.

```sh
npm install --global @suprisecode/cli
# or
bun add --global @suprisecode/cli
```

Configure `SUPRISCODE_URL` and `SUPRISCODE_PASSWORD`, then run:

```sh
suprisecode "Explain this repository" --repo https://github.com/owner/repo
```

This CLI calls the remote SupriseCode API. It does not execute code locally.
