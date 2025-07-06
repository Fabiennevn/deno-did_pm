# DENO Package Manager built with DIDs

### Getting Started

1. [Install Deno](https://deno.land/)

### How it works

This repo uses did:web for example, but any did method that can be resolved will work.

1. Confirm the did can be resolved, for example:

https://did-web.web.app/api/v1/identifiers/did:web:or13.github.io:deno-did-pm

2. confirm the DID Document contains a service

For example:

```json
{
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:web:or13.github.io:deno-did-pm",
  "service": [
    {
      "id": "#github",
      "serviceEndpoint": "https://raw.githubusercontent.com"
    }
  ]
}
```

The `did:web:or13.github.io:deno-did-pm#github` will be used to load software packages from github.

You can replace this with an IPFS URI if you prefer.

3. Start the dereferencer

```
deno cache --unstable --reload ./docs/dereference/mod.ts
deno run --allow-net ./docs/dereference/mod.ts
```

4. Run the example

```
deno cache --unstable --reload ./docs/hello-world.ts
deno run ./docs/hello-world.ts
```
