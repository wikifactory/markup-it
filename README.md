# markup-it

> Pipeline for working with markup input (for example Markdown).

[![Build Status](https://travis-ci.org/GitbookIO/draft-markup.png?branch=master)](https://travis-ci.org/GitbookIO/draft-markup)
[![NPM version](https://badge.fury.io/js/draft-markup.svg)](http://badge.fury.io/js/draft-markup)

### Installation

```
$ npm i markup-it --save
```

### Usage

Initialize a syntax:

```js
var MarkupIt = require('markup-it');
var markdownSyntax = require('markup-it/syntaxes/markdown');
var htmlSyntax = require('markup-it/syntaxes/html');

var markdown = new MarkupIt(markdownSyntax);
var html = new MarkupIt(htmlSyntax);
```

##### Parse a text

```js
var content = markdown.toContent('Hello **World**');
```

##### Render content to text

```js
// Render back to markdown:
var textMd = markdown.toText(content);

// Render to HTML
var textHtml = html.toText(content);
```

##### Usage with Draft.js

`markup-it` can integrates with [Draft-js](https://facebook.github.io/draft-js/).

Generate a [ContentState](https://facebook.github.io/draft-js/docs/api-reference-content-state.html#content) blocks list for draft-js using `DraftUtils.encode`:

```js
var rawContent = MarkupIt.DraftUtils.encode(content);

var blocks = draft.convertFromRaw(rawContent);
var content = draft.ContentState.createFromBlockArray(blocks);
```

And output markdown from a ContentState using `DraftUtils.decode`:

```js
var rawContent = draft.convertToRaw(content);
var content = MarkupIt.DraftUtils.decode(rawContent);

var text = markdown.toText(content);
```

### Markdown Support

This module uses the rules from [kramed](https://github.com/GitbookIO/kramed) to parse Markdown, it supports the whole syntaxes (headings, paragraphs, lists, tables, footnotes, etc). But:

- Reference links are replaced by (resolved) links
- Custom ID for headings (`# My Title #{myID}`) are parsed and added as an entity in the `header-x` block.
- Table are parsed as a block with inner entities for each rows/columns

### Custom Rules

This module contains the [markdown syntax](./syntaxes/markdown), but you can write your custom syntax or extend the existing ones.

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
var mySyntax = markdownSyntax.addBlockRules(myRule);
```

Checkout the [GitBook syntax](https://github.com/GitbookIO/draft-markup/blob/master/syntaxes/gitbook/index.js) as an example of custom rules extending a syntax.

