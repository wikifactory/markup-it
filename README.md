# markup-it [![Build Status](https://travis-ci.org/GitbookIO/markup-it.png?branch=master)](https://travis-ci.org/GitbookIO/markup-it) [![NPM version](https://badge.fury.io/js/markup-it.svg)](http://badge.fury.io/js/markup-it)

`markup-it` is a JavaScript library to parse and modify markuped content (for example Markdown) using an intermediate format backed by an immutable model.


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

#### Parse a text

```js
var content = markdown.toContent('Hello **World**');
```

#### Render content to HTML/Markdown

```js
// Render back to markdown:
var textMd = markdown.toText(content);

// Render to HTML
var textHtml = html.toText(content);
```

#### Usage with Draft.js

`markup-it` can integrates with [Draft-js](https://facebook.github.io/draft-js/) for rich text editing.

Generate a [ContentState](https://facebook.github.io/draft-js/docs/api-reference-content-state.html#content) blocks list for `draft-js` using `DraftUtils.encode`:

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

### Extend Syntax

This module contains the [markdown syntax](./syntaxes/markdown), but you can write your custom syntax or extend the existing ones.

#### Create rules

```js
var myRule = MarkupIt.Rule(DraftMarkup.BLOCKS.HEADING_1)
    .regExp(/^<h1>(\S+)<\/h1>/, function(state, match) {
        return {
            tokens: state.parseAsInline(match[1])
        };
    })
    .toText(function(state, token) {
        return '<h1>' + state.renderAsInline(token) + '</h1>';
    });
```

#### Custom Syntax

Create a new syntax inherited from the markdown one:

```js
var mySyntax = markdownSyntax.addBlockRules(myRule);
```

Checkout the [GitBook syntax](https://github.com/GitbookIO/draft-markup/blob/master/syntaxes/gitbook/index.js) as an example of custom rules extending a syntax.
