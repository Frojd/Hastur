# Hastur
A small node httpserver for rendering of react components (must be transpiled if using experimental features not found in node.js)

## Requirements
- Node.js > 8.x

## Installation & start
1. npm install git://github.com/Frojd/Hastur.git
2. node hastur.js

or

1. Use docker image: frojd/hastur

## Possible parameters

As env:

    HASTUR_PATH=/path/to/components/
    HASTUR_PORT=3000
    HASTUR_HOST=0.0.0.0
    HASTUR_DEBUG=true
    HASTUR_SENTRY=https://xxxx:yyyy@sentry.io/1234

As parameters:

    node hastur.js port 3000 host 0.0.0.0 path /path/to/components/ sentry https://xxxx:yyyy@sentry.io/1234 debug

## How to use
When started (without any parameters) hastur will accept application/json http POST request to http://localhost:3000 with this body:
    
    {
        "componentName": "MyComponent",
        "props": {
            "title": "my props title",
            "anyProp": "another prop"
        },
        "static": false
    }

How it works is that it will try to do a require(componentName) (if HASTUR_PATH is set, it will be joined together before)

If static it will only return the html with no react bindings

## How to build components

Components is easiest built through babel-cli:

    .\node_modules\.bin\babel componentsfolder --out-dir raw --no-babelrc --plugins=transform-class-properties,transform-object-rest-spread --presets=react,env

## Extras

Comes by default with optional sentry logging, if you do not plan to use it, please install with the --no-optional flag
