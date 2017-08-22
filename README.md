# Hastur
A small node httpserver for rendering of react components (must be transpiled if using experimental features not found in node.js)

## Requirements
- Node.js > 8.x

## Installation
1. npm install git://github.com/Frojd/Hastur.git
2. node server.js port 3000 host 0.0.0.0 path /basepath/to/components/

## How to use
Will accept json postrequests on http://localhost:3000/ with this body:
    
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

    babel srcFolder --out-dir myDir
