var fs = require('fs');
var minimatch = require("minimatch");


function parse(content, options) {

    // content = content.replace(/\<\!--([.\n\r]*)?--\>/gi, '');
    content = content.replace(/\<\!--(.|\n|\n\r|\r\n)*?--\>/gi, '');
    // console.log(content)
    var infos = {};

    var appNameMatch = content.match(/ng-app=['"]([^'"]*)['"]/);

    if (appNameMatch) {
        infos.appName = appNameMatch[1];
    }

    infos.files = [];


    var regex = /\<script[^\<]*src=['"]([^'"]*)['"][^\<]*\>[ ]*\<\/script\>/gi;
    while ((result = regex.exec(content))) {

        var filename = result[1];
        var ignore = false;

        // console.log(options.ignore, filename);

        options.ignore.forEach(function (toIgnore) {
            var match = minimatch(filename, toIgnore,  { matchBase: true });
            // console.log(toIgnore, filename, match);
            if (match) {
                // console.log('change ignore');
                ignore = true;
            }
        });

        // console.log('ignore', ignore);
        if (!ignore) {

            for(var prefix in options.prefixes) {
                if (filename.indexOf(prefix) == 0) {
                    filename = filename.replace(prefix, options.prefixes[prefix]);
                    break;
                }
            }

            infos.files.push(filename);
        }



        // infos.files.push
        // console.log(result[1]);
    }
    // console.log(infos.files);

    return infos;
}


function cleanOptions (options) {
    if (!options) {
        options = {};
    }

    if (!options.ignore) {
        options.ignore = [];
    } else if (typeof options.ignore == 'string') {
        options.ignore = [options.ignore];
    }

    if (!options.prefixes) {
        options.prefixes = {};
    }

    return options;
}

module.exports.extract = function (arg1, arg2, arg3) {

    var filename = arg1;
    var callback = null;
    var options = {};
    if (arg3 && typeof arg3 == 'function') {;
        callback = arg3;
        options = arg2;
    } else if (typeof arg2 == 'function'){
        callback = arg2;
    } else {
        return;
    }

    options = cleanOptions(options);

    fs.readFile(arg1, 'utf8', function (err, content) {


        if (err) {
            callback && callback(err);
            return;
        }

        var infos = parse(content, options);

        callback && callback(null, infos);
    });
};

module.exports.extractSync = function (arg1, arg2) {

    var filename = arg1;
    var options = arg2;

    options = cleanOptions(options);

    var content = fs.readFileSync(arg1, 'utf8');
    var infos = parse(content, options);
    return JSON.parse(JSON.stringify(infos));
};
