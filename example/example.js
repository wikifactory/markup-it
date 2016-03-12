var React = require('react');
var ReactDOM = require('react-dom');

var MarkdownEditor = require('./markdown');

var EXAMPLE_SOURCE = require('./example.md');

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
