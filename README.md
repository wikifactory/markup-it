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
var markdown = require('draft-markup/syntaxes/markdown');

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
- Custom ID for headings (`# My Title #{myID}`) are parsed and added as an entity in the `header-x` block.
- Table are parsed as a block with inner entities for each rows/columns

### Writing custom rules

This module contains the [markdown syntax](./rules/markdown.js), but you can write your custom set of rules or extend the existing ones.

```js
var myRule = DraftMarkup.Rule(DraftMarkup.BLOCKS.HEADING_1)
    .regExp(/^<h1>(\S+)<\/h1>/, function(match) {
        return {
            text: match[1]
        };
    })
    .toText(function(innerText) {
        return '<h1>' + innerText+ '</h1>';
    });
```

Create a new syntax inherited from the markdown one:

```js
var mySyntax = DraftMarkup.Syntax(markdown);


// Add a new rule
mySyntax.blocks.add(myRule);

//Remove a rule
mySyntax.blocks.del(DraftMarkup.BLOCKS.HEADING_1);

// Replace a rule
mySyntax.blocks.replace(myRule);
```

A good example of this is the syntax for [gitbook](./syntaxes/gitbook).

