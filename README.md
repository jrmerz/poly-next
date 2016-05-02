# poly-next

Modularize your entire app developement.  Build with Polymer, React and ES6/ES.Next Code.

This project is about modules and using them build your app from end to end.

## Quick Start

Use with single module from command line like:
```
npm install -g poly-next

# then using this repos example
git clone https://github.com/jrmerz/poly-next
cd poly-next/example

poly-next -r app -m elements
```

Please see /example directory for example project layout.

## Separation of Concerns

I'm a big fan of Polymer but I want to re-use as much code as possible,
have no business logic wrapped up in web components, be able to use standard
mocha/chai to test my code (as much as possible) without involving the browser.

## How this project works

You write modules.  Modules for your client, modules for your server, modules
for both.  If you need a UI component, you can write Polymer or React.  For 
Polymer, you also include a .html file with the \<dom-module /> template (No JS).  You 
can write both ES6 JS and JSX code as all code will go through browserify + babel +
React.  The server (or included middleware) will pre-bundle your code into a 
single (virtual) html imports file with source maps.  So all will look as you
wrote it on the client.  When you are ready, you can dump the imports file to 
your /dist dir.

## Config

You just need to set
 - The root of the webapp
 - The root of your code to crawl 

Default Config
```js
{
    root : __dirname+'/app',
    port : 8080,
    modules : [],
    browserify : {
        debug: true
    },
    babel : {
        presets : ['es2015', 'react']
    }
}
```

Sample Config
```js
{
    root : '/path/to/app/root/public',
    port : 8080,
    modules : [{
        urlpath : 'elements',
        name : 'bundled_index'
    }],
    browserify : {
        debug: true
    },
    babel : {
        presets : ['es2015', 'react']
    }
}
```

The above sample will server http://localhost:8080/ and provide a html imports file @
http://localhost:8080/elements/bundled_index.html

## Middleware

```js
var polyNextMiddleware = require('poly-next');
var express = require('express');
var app = express();

var config = {
    // see above
}

app.use(polyNextMiddleware(config));
app.use(express.static(config.root));

app.listen(config.port);
```

## Command Line Help

```bash
poly-next -h
```

## Final Bit

This project is a thought experiment.  Please feel free to add yours.