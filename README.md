# draft-text

> Pipeline for using text input (for example Markdown) with Draft-js

[![Build Status](https://travis-ci.org/GitbookIO/draft-text.png?branch=master)](https://travis-ci.org/GitbookIO/draft-text)
[![NPM version](https://badge.fury.io/js/draft-text.svg)](http://badge.fury.io/js/draft-text)

### Installation

```
$ npm i draft-text --save
```

### Usage

Initialize a syntax:

```js
var DraftText = require('draft-text');
var markdown = require('draft-text/rules/markdown');

var draftText = new DraftText(markdown);
```

Generate a [ContentState](https://facebook.github.io/draft-js/docs/api-reference-content-state.html#content) blocks list for draft-js:

```js
var rawContent = draftText.toRawContent('# Hello World\n\nThis is **bold**.');
var blocks = draft.convertFromRaw(rawContent);
var content = draft.ContentState.createFromBlockArray(blocks);
```

Output markdown from a ContentState:

```js
var rawContent = draft.convertToRaw(content);
var text = draftText.toText(rawContent);
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

