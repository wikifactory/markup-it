# Draft + Markdown = <3

> "Markdown is so Awesome" - Someone

This example is proof-of-concept of [Draft](http://draftjs.org) being used with **Markdown**.

It uses [draft-markup](https://github.com/GitBookIO/draft-markup) to parse markdown into Draft's `ContentState`, then output Markdown from Draft's `ContentState`:

```
Markdown -> [draft-markup] -> ContentState -> Draft -> ContentState -> [draft-markup] -> Markdown
```

### Edit it

You can edit this content!

In the top-right panel, you can see the realtime Markdown output. And a JSON dump of the ContentState in the bottom-right panel.

### What does it support?

- Heading
- Paragraph
- Inline styling (**bold**, _italic_, ~~Strikethrought~~)
- Lists
  - UL
  - OL
- Links
- Images
- Footnotes
- Blockquotes
- HR
- Escaped Syntax: \*escaped\*
- Table (soon !)
- HTML (soon !)


![My Image](https://facebook.github.io/react/img/logo.svg)

---

### Code Blocks

You can use code blocks:

    var a = 42;
    console.log(a);


GFM Fences are also supported:

```js
var msg = "Hello World";
```

### Table

Tables are not working correctly for now, but we are working on it.

| Col 1 | Col 2 |
| ----- | ----- |
| Cell 1.1 | Cell 1.2 |
| Cell 2.1 | Cell 2.2 |

