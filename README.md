# Hastur
A small node http server for rendering of react components (must be transpiled if using experimental features not found in node.js)

## Requirements
- Node.js > 8.x

## Installation & start
1. npm install git://github.com/Frojd/Hastur.git
2. node hastur.js

or

1. Use docker image: frojd/hastur

## Server configurations

As env variables:
```
    HASTUR_PATH=/path/to/components/
    HASTUR_PORT=3000
    HASTUR_HOST=0.0.0.0
    HASTUR_DEBUG=true
    HASTUR_SENTRY=https://xxxx:yyyy@sentry.io/1234
    HASTUR_JSON_SNAKE_TO_CAMEL=true
    HASTUR_STRIP_DOT_PREFIX=true
```

or as parameters:

    node app.js --port 3000 --host 0.0.0.0 --path /path/to/components/ --sentry https://xxxx:yyyy@sentry.io/1234 --debug --toCamelFromSnake --stripDotPrefix


## How to use

When started without any parameters, Hastur will accept application/json http POST request at http://localhost:3000 with this body:

```json
{
  "componentName": "MyComponent",
  "props": {
    "title": "my props title",
    "anyProp": "another prop"
  },
  "static": false,
  "context": {
    "location": "https://mysite.com",
    "otherContext": "foo"
  }
}
```

The above request will try to do a require(`componentName`) and render it with the passed along `props`.
If `HASTUR_PATH` is set, it will be prepended to the `componentName`.

**`static` (optional, default: false):**

If true, Hastur will return html without react bindings

 **`context` (optional, default: undefined)**

If you need to pass along things that otherwise would not be included on the server side (such as request-info)
you can pass it along in the `context` attribute:

```json
{
  "location": "https://somesite.com/foo"
}
```

You can access it in your components via the `SSRContext` object, allowing you to do stuff like:

```js
const currentURL = SSRContext.location ? SSRContext.location : window.location;
if (currentURL.search(/foo/)) {
  console.log('The requested URL contains "foo"');
}
```


<<<<<<< Updated upstream
## How to build components

Components is easiest built through babel-cli:

```
    .\node_modules\.bin\babel componentsfolder --out-dir raw --no-babelrc --plugins=transform-class-properties,transform-object-rest-spread --presets=react,env
```

=======
>>>>>>> Stashed changes
## Extras

Comes by default with optional sentry logging, if you do not plan to use it, please install with the `--no-optional` flag
