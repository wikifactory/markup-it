var React = require('react');
var ReactDOM = require('react-dom');

var MarkdownEditor = require('./markdown');

var EXAMPLE_SOURCE = (
    '# Heading 1\n' +
    '## Heading 2\n' +
    '### Heading 3\n' +
    '#### Heading 4\n' +
    'This is a **very** simple _example_ of `draft` + `draft-text` using ~~Asciidoc~~ Markdown.\n\n' +
    'Escape syntax is kept \\*escaped\\*.\n\n' +
    '> Blockquote, HR and code blocks are supported\n\n' +
    'But it supports [links](https://google.fr) and images. In this example, click on the links/images to edit.\n\n' +
    '![My Image](https://facebook.github.io/react/img/logo.svg)\n\n' +
    '---\n\n' +
    '\tvar a = 42;\n' +
    '\tconsole.log(a);\n\n' +
    'GitHub Fences are also supported:\n\n' +
    '```js\nHello World\n```\n'
);

var Example = React.createClass({
    getInitialState: function() {
        return {
            content: EXAMPLE_SOURCE,
            rawState: {}
        };
    },

    onEditorChanged: function(content, rawState) {
        this.setState({
            content: content,
            rawState: rawState
        });
    },

    render: function() {
        return <div className="Example">
            <div className="Example-Editor">
                <MarkdownEditor content={this.state.content} onChange={this.onEditorChanged} />
            </div>
            <div className="Example-Preview"><pre>{this.state.content}</pre></div>
            <div className="Example-RawState"><pre>{JSON.stringify(this.state.rawState, null, 4)}</pre></div>
        </div>;
    }
});


// Render example application
ReactDOM.render(
    <Example />,
    document.getElementById('target')
);
