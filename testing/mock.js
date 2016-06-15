var MarkupIt = require('../');

var hello = MarkupIt.Token({
    type: MarkupIt.STYLES.TEXT,
    text: 'Hello ',
    raw: 'Hello '
});

var world = MarkupIt.Token({
    type: MarkupIt.STYLES.BOLD,
    text: 'World',
    raw: '**World**'
});

var helloTitle = MarkupIt.Token({
    type: MarkupIt.BLOCKS.HEADING_1,
    text: 'Hello',
    raw: '# Hello',
    tokens: [
        hello
    ]
});

var helloWorld = MarkupIt.Token({
    type: MarkupIt.BLOCKS.PARAGRAPH,
    text: 'Hello World',
    raw: 'Hello **World**',
    tokens: [
        hello,
        world
    ]
});

module.exports = {
    paragraph: MarkupIt.Content.createFromTokens('mysyntax', [helloWorld]),
    titleParagraph: MarkupIt.Content.createFromTokens('mysyntax', [helloTitle, helloWorld])
};
