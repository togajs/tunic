/*jshint maxlen:false */
'use strict';

var assert = require('assert');
var fs = require('fs');
var tunic = require('../../lib/tunic');
var Tunic = tunic;

describe('Tunic', function () {
    it('should ignore non-blocks', function() {
        var ignore = fs.readFileSync(__dirname + '/../fixtures/ignore.js', 'utf8');

        assert.deepEqual(tunic(ignore), [
            { 'type': 'Code', 'body': '// ignore\n/* ignore */\n/*! ignore */\n\n//\n// ignore\n//\n/*\n * ignore\n */\n/*!\n * ignore\n */\n\n// /** ignore\nvar ignore = \'/** ignore */\';\nvar foo = function(/** ignore */) {};\nconsole.log(foo(ignore));\n// ignore */\n' }
        ]);
    });

    it('should parse empty blocks', function() {
        var empty = fs.readFileSync(__dirname + '/../fixtures/empty.js', 'utf8');

        assert.deepEqual(tunic(), [
            { 'type': 'Code', 'body': 'undefined' }
        ]);

        assert.deepEqual(tunic(null), [
            { 'type': 'Code', 'body': 'null' }
        ]);

        assert.deepEqual(tunic(''), [
            { 'type': 'Code', 'body': '' }
        ]);

        assert.deepEqual(tunic(empty), [
            { 'type': 'Code', 'body': '/**/\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [] },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });

    it('should parse descriptions', function() {
        var desc = fs.readFileSync(__dirname + '/../fixtures/desc.js', 'utf8');

        assert.deepEqual(tunic(desc), [
            { 'type': 'Code', 'body': '' },
            { 'type': 'DocBlock', 'description': 'description', 'tags': [] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': 'description', 'tags': [] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': 'description', 'tags': [] },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });

    it('should parse tags', function() {
        var tag = fs.readFileSync(__dirname + '/../fixtures/tag.js', 'utf8');

        assert.deepEqual(tunic(tag), [
            { 'type': 'Code', 'body': '' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'tag', 'type': '{Type}', 'description': 'Description here.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'tag', 'type': '{Type}', 'description': 'Description here.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'tag', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'tag', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'tag' }] },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });

    it('should parse args', function() {
        var arg = fs.readFileSync(__dirname + '/../fixtures/arg.js', 'utf8');

        assert.deepEqual(tunic(arg), [
            { 'type': 'Code', 'body': '' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Type}', 'name': '[name]', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Type}', 'name': '[name]', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Type}', 'name': '[name]' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Type}', 'name': 'name' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': '[name]', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': '[name]', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': 'name', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': 'name', 'description': 'Description.' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': '[name]' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': 'name' }] },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });

    it('should parse types', function() {
        var type = fs.readFileSync(__dirname + '/../fixtures/type.js', 'utf8');

        assert.deepEqual(tunic(type), [
            { 'type': 'Code', 'body': '' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Type}' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{String|Object}' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Array.<Object.<String,Number>>}' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'type': '{Function(String, ...[Number]): Number}', 'name': 'callback' }] },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });

    it('should parse names', function() {
        var name = fs.readFileSync(__dirname + '/../fixtures/name.js', 'utf8');

        assert.deepEqual(tunic(name), [
            { 'type': 'Code', 'body': '' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': 'name' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': '[name]' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': '[name={}]' }] },
            { 'type': 'Code', 'body': '\n' },
            { 'type': 'DocBlock', 'description': '', 'tags': [{ 'tag': 'arg', 'name': '[name="hello world"]' }] },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });

    it('should handle indention', function() {
        var indent = fs.readFileSync(__dirname + '/../fixtures/indent.js', 'utf8');
        var standardParser = new Tunic();
        var tokens = standardParser.parse(indent, {
            raw: true
        });

        assert.deepEqual(tokens, [
            { 'type': 'Code', 'body': '' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '/**\n * # Title\n *\n * Long description that spans multiple\n * lines and even has other markdown\n * type things.\n *\n * Like more paragraphs.\n *\n * * Like\n * * Lists\n *\n *     var code = \'samples\';\n *\n * @arg {Type} name Description.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n * @arg {Type} name Description that is really long\n *   and wraps to other lines.\n *\n *   And has line breaks, etc.\n *\n * @example\n *\n *     var foo = \'bar\';\n *\n * @tag\n */'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '/**\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    var foo = \'bar\';\n\n@tag\n */'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '/**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = \'samples\';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = \'bar\';\n\n    @tag\n */'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '    /**\n     * # Title\n     *\n     * Long description that spans multiple\n     * lines and even has other markdown\n     * type things.\n     *\n     * Like more paragraphs.\n     *\n     * * Like\n     * * Lists\n     *\n     *     var code = \'samples\';\n     *\n     * @arg {Type} name Description.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     * @arg {Type} name Description that is really long\n     *   and wraps to other lines.\n     *\n     *   And has line breaks, etc.\n     *\n     * @example\n     *\n     *     var foo = \'bar\';\n     *\n     * @tag\n     */'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '    /**\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        var code = \'samples\';\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        var foo = \'bar\';\n\n    @tag\n     */'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    var code = \'samples\';\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    var foo = \'bar\';\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '    /**\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            var code = \'samples\';\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            var foo = \'bar\';\n\n        @tag\n    */'
            },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });

    it('should use custom handlebars grammar', function() {
        var custom = fs.readFileSync(__dirname + '/../fixtures/custom.hbs', 'utf8');

        var handlebarParser = new Tunic({
            blockSplit: /(^[\t ]*\{\{!---(?!-)[\s\S]*?\s*--\}\})/m,
            blockParse: /^[\t ]*\{\{!---(?!-)([\s\S]*?)\s*--\}\}/m,
            indent: /^[\t !]/gm,
            named: /^(arg(gument)?|data|prop(erty)?)$/
        });

        var tokens = handlebarParser.parse(custom, {
            raw: true
        });

        assert.deepEqual(tokens, [
            { 'type': 'Code', 'body': '' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' },
                    { 'tag': 'tag', 'description': '\n' }
                ],
                'raw': '{{!---\n  ! # Title\n  !\n  ! Long description that spans multiple\n  ! lines and even has other markdown\n  ! type things.\n  !\n  ! Like more paragraphs.\n  !\n  ! * Like\n  ! * Lists\n  !\n  !     <code>samples</code>\n  !\n  ! @arg {Type} name Description.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  ! @arg {Type} name Description that is really long\n  !   and wraps to other lines.\n  !\n  !   And has line breaks, etc.\n  !\n  ! @example\n  !\n  !     <ul>\n  !         {{#each item}}\n  !             <li>{{.}}</li>\n  !         {{/each}}\n  !     </ul>\n  !\n  ! @tag\n  !--}}'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '{{!---\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n@tag\n--}}'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>{{samples}}</code>\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '{{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>{{samples}}</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n--}}'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' },
                    { 'tag': 'tag', 'description': '\n' }
                ],
                'raw': '    {{!---\n      ! # Title\n      !\n      ! Long description that spans multiple\n      ! lines and even has other markdown\n      ! type things.\n      !\n      ! Like more paragraphs.\n      !\n      ! * Like\n      ! * Lists\n      !\n      !     <code>samples</code>\n      !\n      ! @arg {Type} name Description.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      ! @arg {Type} name Description that is really long\n      !   and wraps to other lines.\n      !\n      !   And has line breaks, etc.\n      !\n      ! @example\n      !\n      !     <ul>\n      !         {{#each item}}\n      !             <li>{{.}}</li>\n      !         {{/each}}\n      !     </ul>\n      !\n      ! @tag\n      !--}}'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>samples</code>\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '    {{!---\n    # Title\n\n    Long description that spans multiple\n    lines and even has other markdown\n    type things.\n\n    Like more paragraphs.\n\n    * Like\n    * Lists\n\n        <code>samples</code>\n\n    @arg {Type} name Description.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n    @arg {Type} name Description that is really long\n      and wraps to other lines.\n\n      And has line breaks, etc.\n\n    @example\n\n        <ul>\n            {{#each item}}\n                <li>{{.}}</li>\n            {{/each}}\n        </ul>\n\n    @tag\n    --}}'
            },
            { 'type': 'Code', 'body': '\n\n' },
            {
                'type': 'DocBlock',
                'description': '# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    <code>{{samples}}</code>\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    <ul>\n        {{#each item}}\n            <li>{{.}}</li>\n        {{/each}}\n    </ul>\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '    {{!---\n        # Title\n\n        Long description that spans multiple\n        lines and even has other markdown\n        type things.\n\n        Like more paragraphs.\n\n        * Like\n        * Lists\n\n            <code>{{samples}}</code>\n\n        @arg {Type} name Description.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n        @arg {Type} name Description that is really long\n          and wraps to other lines.\n\n          And has line breaks, etc.\n\n        @example\n\n            <ul>\n                {{#each item}}\n                    <li>{{.}}</li>\n                {{/each}}\n            </ul>\n\n        @tag\n    --}}'
            },
            { 'type': 'Code', 'body': '\n\n{{! ignore }}\n{{!-- ignore --}}\n{{!\n  ! ignore\n  !}}\n<!-- {{!--- ignore -->\n<!-- ignore }} -->\n' }
        ]);
    });

    it('should use custom perl grammar', function() {
        var custom = fs.readFileSync(__dirname + '/../fixtures/custom.pl', 'utf8');

        var perlParser = new Tunic({
            blockSplit: /(^=pod[\s\S]*?\n=cut$)/m,
            blockParse: /^=pod([\s\S]*?)\n=cut$/m,
            named: /^(arg(gument)?|data|prop(erty)?)$/
        });

        var tokens = perlParser.parse(custom, {
            raw: true
        });

        assert.deepEqual(tokens, [
            { 'type': 'Code', 'body': 'use strict;\nuse warnings;\n\nprint "hello world";\n\n' },
            {
                'type': 'DocBlock',
                'description': '\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    my $code = "samples";\n\n',
                'tags': [
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n' },
                    { 'tag': 'arg', 'type': '{Type}', 'name': 'name', 'description': 'Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n' },
                    { 'tag': 'example', 'description': '\n\n    my $foo = "bar";\n\n' },
                    { 'tag': 'tag' }
                ],
                'raw': '=pod\n\n# Title\n\nLong description that spans multiple\nlines and even has other markdown\ntype things.\n\nLike more paragraphs.\n\n* Like\n* Lists\n\n    my $code = "samples";\n\n@arg {Type} name Description.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n@arg {Type} name Description that is really long\n  and wraps to other lines.\n\n  And has line breaks, etc.\n\n@example\n\n    my $foo = "bar";\n\n@tag\n\n=cut'
            },
            { 'type': 'Code', 'body': '\n' }
        ]);
    });
});
