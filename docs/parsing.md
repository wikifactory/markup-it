# Parsing

This chapter will explain how to parse a markdown text using `markup-it`.

### Create a new state

The first step is to create a MarkupIt State with the right set of rules.

```js
const { State } = require('markup-it')
const markdown = require('markup-it/lib/markdown')

const state = State.create(markdown)
```

### Deserialize text to a node

```js
const document = state.deserialize('Hello **World**')
```

### Add new rules
