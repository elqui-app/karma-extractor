# karma-extractor
Extract informations (path to js, app name) from index.html to make karma.conf.js more sustainable/maintainable.

Without **karma-extractor**, as soon as you add a dependency to your index.html, you also need to add them to your *karma.conf.js* in the **files** argument.

A solution to avoid this issue is to add all files to your *karma.conf.js* but your tests don't reflect reality.

With **karma-extractor**, your tests have exactly the same dependencies than your real project, at any time.

## Getting started


```javascript

var extractor = require('karma-extractor');

// asynchronous without options
extractor.extract('index.html', function (err, infos) {
    // infos.appName
    // infos.files
});

var options = {
    ignore: ['/socket.io/socket.io.js', 'https://*'], // default = [], use minimatch regex
    prefixes: { // default = {}
        '/bower_components/': '../bower_components'
    }
};

// asynchronous without options
extractor.extract('index.html', options, function (err, infos) {
    // infos.appName
    // infos.files
});

// synchronous
try {
    var infos = extractor.extractSync('index.html', options);
} catch (e) {

}


```
