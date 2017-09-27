# Hastur
A small node httpserver for rendering of react components (must be transpiled if using experimental features not found in node.js)

## Requirements
- Node.js > 8.x

## Installation
1. npm install git://github.com/Frojd/Hastur.git
2. node hastur.js port 3000 host 0.0.0.0 path /basepath/to/components/ sentry https://xxxx:yyyy@sentry.io/1234

## How to use
Will accept json postrequests on http://localhost:3000/ (if no parameters is set) with this body:
    
    {
        "componentName": "MyComponent",
        "props": {
            "title": "my props title",
            "anyProp": "another prop"
        },
        "static": false
    }

If static it will only return the html with no react bindings

Components is easiest built through babel-cli:

    .\node_modules\.bin\babel componentsfolder --out-dir raw --no-babelrc --plugins=transform-class-properties,transform-object-rest-spread --presets=react,env

## Extras

Comes by default with optional sentry logging, if you do not plan to use it, please install with the --no-optional flag
