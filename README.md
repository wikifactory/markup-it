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

### Markdown Support

This module uses the rules from [kramed](https://github.com/GitbookIO/kramed) to parse Markdown, it supports the whole syntaxes (headings, paragraphs, lists, tables, footnotes, etc). But:

- Reference links are replaced by (resolved) links


### Write custom rules

This module contains the [markdown syntax](./rules/markdown.js), but you can write your custom set of rules or extend the existing ones.

A set of rules is an object with two properties: `inlines` and `blocks`; both are `Array<Rule>`.

A rule is a JS object with properties:

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
    toText: function(innerText, entity || block, ctx) {
        // For blocks, "ctx" contains two properties: "next" and "prev"
    }
}
```

`match` can be replaced by `regexp` and `props`.

