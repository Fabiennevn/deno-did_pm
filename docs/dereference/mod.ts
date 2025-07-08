// import { Application, Router, helpers } from "https://deno.land/x/oak/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as helpers from "https://deno.land/x/oak@v12.6.1/helpers.ts";

const { getQuery } = helpers;

const router = new Router();

//router
router
  .get("/", (context) => {
    context.response.body = "Hello world!";
  })
  .get("/did-modules/:did", async (context) => {
    const params = getQuery(context, { mergeParams: true });

    if (!params.did) {
      context.response.status = 400;
      context.response.body = "DID is required.";
      return;
    }

    //  OLD resolver (deprecated / broken)
    /*
    const res = await fetch(
      `https://did-web.web.app/api/v1/identifiers/${params.did}`
    );
    */

    //  NEW working resolver
    const res = await fetch(
      `https://resolver.identity.foundation/1.0/identifiers/${params.did}`,
    );

    const didDocument = await res.json();

    //  Defensive check: ensure 'service' exists
    if (!didDocument.service || !Array.isArray(didDocument.service)) {
      context.response.status = 500;
      context.response.body = "DID Document does not contain a valid 'service' section.";
      return;
    }

    if (params.service && params.relativeRef) {
      const service = didDocument.service.find((s: any) => {
        return s.id === "#" + params.service;
      });

      if (!service) {
        context.response.status = 404;
        context.response.body = `Service '#${params.service}' not found in DID document.`;
        return;
      }

      const absoluteRef = service.serviceEndpoint + params.relativeRef;
      context.response.redirect(absoluteRef);
    } else {
      context.response.status = 400;
      context.response.body = "Missing 'service' or 'relativeRef' in query parameters.";
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log(" Deno DID Dereferencer is running.");
console.log(
  "🔗 Example Module:\n" +
  "http://localhost:8000/did-modules/did:web:fabiennevn.github.io:deno-did-pm" +
  "?service=github&relativeRef=/Fabiennevn/deno-did-pm/master/docs/hello-world.ts"
);

await app.listen({ port: 8000 });
