# draft-markup

> Pipeline for using markup input (for example Markdown) with Draft-js

[![Build Status](https://travis-ci.org/GitbookIO/draft-markup.png?branch=master)](https://travis-ci.org/GitbookIO/draft-markup)
[![NPM version](https://badge.fury.io/js/draft-markup.svg)](http://badge.fury.io/js/draft-markup)

### Installation

```
$ npm i draft-markup --save
```

### Usage

Initialize a syntax:

```js
var DraftMarkup = require('draft-markup');
var markdown = require('draft-markup/rules/markdown');

var draftMarkup = new DraftMarkup(markdown);
```

Generate a [ContentState](https://facebook.github.io/draft-js/docs/api-reference-content-state.html#content) blocks list for draft-js:

```js
var rawContent = draftMarkup.toRawContent('# Hello World\n\nThis is **bold**.');
var blocks = draft.convertFromRaw(rawContent);
var content = draft.ContentState.createFromBlockArray(blocks);
```

Output markdown from a ContentState:

```js
var rawContent = draft.convertToRaw(content);
var text = draftMarkup.toText(rawContent);
```

### Write custom rules

This module ships with the [markdown syntax](./rules/markdown.js), but you can write your custom set of rules or extend the existing one.

A set of rules is an object with two properties: `inlines` and `blocks`; both are list of rules.

A rule is a basic object with properties:

```js
{
    type: 'heading_1',

    // Extract a match or "null" from the text
    match: function(text) {
        return {
            raw: ...,
            text: ...
        };
    },

    // Convert a match to text
    toText: function(text, entity) {

    }
}
```

`match` can be replaced by `regexp` and `props`.

