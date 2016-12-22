# markup-it

[![Build Status](https://travis-ci.org/GitbookIO/markup-it.svg?branch=master)](https://travis-ci.org/GitbookIO/markup-it)
[![NPM version](https://badge.fury.io/js/markup-it.svg)](http://badge.fury.io/js/markup-it)

`markup-it` is a JavaScript library to serialize/deserialize markdown content using an intermediate format backed by an immutable model.


### Installation

```
$ npm i markup-it --save
```

### Usage

Initialize a syntax:

```js
const MarkupIt = require('markup-it');
const markdownSyntax = require('markup-it/lib/markdown');
const htmlSyntax = require('markup-it/lib/html');

const markdown = new MarkupIt(markdownSyntax);
const html = new MarkupIt(htmlSyntax);
```

#### Parse markdown

```js
const { State } = require('markup-it');
const markdown = require('markup-it/lib/markdown');

const state = State.create(markdown);
const document = state.deserializeToDocument('Hello **World**');
```

#### Render document to HTML

```js
const { State } = require('markup-it');
const html = require('markup-it/lib/html');

const state = State.create(html);
const str = state.serializeDocument(document);
```

#### Render document to Markdown

```js
const { State } = require('markup-it');
const markdown = require('markup-it/lib/markdown');

const state = State.create(markdown);
const str = state.serializeDocument(document);
```
