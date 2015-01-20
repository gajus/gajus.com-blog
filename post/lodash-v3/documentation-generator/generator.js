var _ = require('lodash'),
    Promise = require('bluebird'),
    request = require('request-promise'),
    commentParser = require('comment-parser'),
    fs = require('fs'),
    methods,
    lastGroup,
    docs = '',
    index = '';

methods = [
    'string/camelCase',
    'string/capitalize',
    'string/deburr',
    'string/endsWith',
    'string/escapeRegExp',
    'string/kebabCase',
    'string/pad',
    'string/padLeft',
    'string/padRight',
    'string/repeat',
    'string/snakeCase',
    'string/startsWith',
    'string/trim',
    'string/trimLeft',
    'string/trimRight',
    'string/trunc',
    'string/words',
    'array/chunk',
    'array/dropRight',
    'array/dropRightWhile',
    'array/dropWhile',
    'array/flattenDeep',
    'array/pullAt',
    'array/slice',
    'array/sortedLastIndex',
    'array/takeRight',
    'array/takeRightWhile',
    'array/takeWhile',
    'function/ary',
    'function/before',
    'function/curryRight',
    'function/flow',
    'function/negate',
    'function/rearg',
    'lang/isError',
    'lang/isMatch',
    'lang/isNative',
    'lang/isTypedArray',
    'lang/toPlainObject',
    'utility/attempt',
    'utility/matches',
    'utility/propertyOf',
    'collection/partition',
    'collection/sortByAll',
    'object/keysIn',
    'object/valuesIn',
    'chain/thru'
];

docs += '# Lo-Dash v3 Documentation\n\n';
docs += 'lo-Dash v3 documentation generated from source code as described in the [article](http://gajus.com/blog/4/lodash).\n\n';

Promise
    .all(methods)
    .map(function (name) {
        return Promise.props({
            name: name,
            body: request('https://raw.githubusercontent.com/lodash/lodash/es6/' + name + '.js')
        })
    })
    .each(function (method) {
        var comments,
            example,
            params,
            returns,
            body = method.body,
            group = method.name.split('/')[0],
            name = method.name.split('/')[1];

        comments = commentParser(body);
        comments = comments[comments.length - 1];

        if (lastGroup !== group) {
            docs += '## ' + group + '\n\n';

            index += '\n### ' + group + '\n\n';
            index += '| Name | Description |\n';
            index += '| --- | --- |\n';

            lastGroup = group;
        }

        index += '| [`' + name + '`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#' + name.toLowerCase() + ')| ' + comments.description.replace(/\n/g, ' ') + ' |\n';

        docs += '### ' + name + '\n\n';
        docs += 'https://raw.githubusercontent.com/lodash/lodash/es6/' + method.name + '.js\n\n';
        docs += comments.description.split('\n').join('\n\n');

        params = _.where(comments.tags, {tag: 'param'});

        if (params.length) {
            docs += '\n\n#### Parameters\n\n';

            docs += '| Name | Type | Description |\n';
            docs += '| --- | --- | --- |\n';

            params.forEach(function (param) {
                docs += '| `' + param.name + '` | `' + param.type + '` | ' + param.description + '|\n';
            });
        }

        returns = _.where(comments.tags, {tag: 'returns'});

        if (returns.length) {
            docs += '\n\n#### Returns\n\n';

            docs += '| Type | Description |\n';
            docs += '| --- | --- |\n';
            docs += '| `' + returns[0].type + '` | ' + returns[0].description + '|\n';
        }

        example = _.where(comments.tags, {tag: 'example'});

        if (example.length) {
            docs += '\n```js\n' + example[0].description + '\n```';
        }

        docs += '\n\n';
    })
    .then(function () {
        fs.writeFileSync(__dirname + '/../documentation.md', docs);

        console.log(index);
    });
