# draft-syntax

> Utility to work with markdown string

### Installation

```
$ npm i draft-syntax --save
```

### Usage

Initialize a syntax:

```js
var Syntax = require('draft-syntax').Syntax;
var markdown = require('draft-syntaxes/rules/markdown');

var syntax = new Syntax(markdown);
```

Generate a [ContentState](https://facebook.github.io/draft-js/docs/api-reference-content-state.html#content) blocks list for draft-js:

```js
var rawContent = syntax.toRawContent('# Hello World\n\nThis is **bold**.');
var content = draft.convertFromRaw(rawContent);
```

Output markdown from a ContentState:

```js
var rawContent = draft.convertToRaw(content);
var text = syntax.toText(rawContent);
```

### Write custom rules

This module ships with the [markdown syntax](./rules/markdown.js), but you can write your custom set of rules or extend the existing one.

A set of rules is an object with two properties: `inlines` and `blocks`; both are list of rules.

A rule is a basic object with properties:

```js
{
    type: 'heading_1',
    match: function(text) {
        return {
            raw: ...,
            text: ...
        };
    },
    toText: function(text, props) {

    }
}
```

`match` can be replaced by `regexp` and `props`.

