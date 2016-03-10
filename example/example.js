var React = require('react');
var ReactDOM = require('react-dom');
var draft = require('draft-js');

var DraftText = require('../');
var markdown = require('../rules/markdown');

var EXAMPLE_SOURCE = (
    '# Heading 1\n' +
    '## Heading 2\n' +
    '### Heading 3\n' +
    '#### Heading 4\n' +
    'This is a **very** simple _example_ of draft + markdown.\n\n' +
    '> Blockquote and code blocks are supported\n\n' +
    '\tvar a = 42;\n' +
    '\tconsole.log(a);\n\n'
);

var INLINE_STYLES = [
    { label: 'Bold', style: DraftText.INLINES.BOLD },
    { label: 'Italic', style: DraftText.INLINES.ITALIC },
    { label: 'Code', style: DraftText.INLINES.CODE }
];

var BLOCK_TYPES = [
    { label: 'H1', style: DraftText.BLOCKS.HEADING_1 },
    { label: 'H2', style: DraftText.BLOCKS.HEADING_2 },
    { label: 'H3', style: DraftText.BLOCKS.HEADING_3 },
    { label: 'H4', style: DraftText.BLOCKS.HEADING_4 },
    { label: 'H5', style: DraftText.BLOCKS.HEADING_5 },
    { label: 'H6', style: DraftText.BLOCKS.HEADING_6 },
    { label: 'Blockquote', style: DraftText.BLOCKS.BLOCKQUOTE },
    { label: 'UL', style: DraftText.BLOCKS.UL },
    { label: 'OL', style: DraftText.BLOCKS.OL },
    { label: 'Code Block', style: DraftText.BLOCKS.CODE },
];


// Return className for a block
function getBlockStyle(block) {
    return 'MarkdownEditor-block MarkdownEditor-' + block.getType();
}

// Create draft-text instance
var draftText = new DraftText(markdown);


// Button to toggle style
var StyleButton = React.createClass({
    onToggle: function(e) {
        e.preventDefault();
        this.props.onToggle(this.props.style);
    },

    render: function() {
        var className = 'MarkdownEditor-styleButton';
        if (this.props.active) {
            className += ' MarkdownEditor-activeButton';
        }

        return <span className={className} onMouseDown={this.onToggle}>
            {this.props.label}
        </span>;
    }
});

// Style controls bar
var BlockStyleControls =  React.createClass({
    render: function() {
        var editorState = this.props.editorState;
        var selection = editorState.getSelection();
        var blockType = editorState
            .getCurrentContent()
            .getBlockForKey(selection.getStartKey())
            .getType();

        return <div className="MarkdownEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={this.props.onToggle}
                    style={type.style}
                />
            )}
        </div>;
    }
});
var InlineStyleControls =  React.createClass({
    render: function() {
        var currentStyle = this.props.editorState.getCurrentInlineStyle();

        return <div className="MarkdownEditor-controls">
            {INLINE_STYLES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={this.props.onToggle}
                    style={type.style}
                />
            )}
        </div>;
    }
});


// Markdown editor component
var MarkdownEditor = React.createClass({

    // Create initial state for editor using example text source
    getInitialState: function() {
        var rawContent = draftText.toRawContent(this.props.content);
        var blocks = draft.convertFromRaw(rawContent);
        var content = draft.ContentState.createFromBlockArray(blocks);
        var editorState = draft.EditorState.createWithContent(content);

        return {
            editorState: editorState
        };
    },

    // Draft's editor content changed
    onChange: function(editorState) {
        var content = editorState.getCurrentContent();
        var rawContent = draft.convertToRaw(content);
        var text = draftText.toText(rawContent);

        this.setState({
            editorState: editorState
        });

        if (this.props.onChange) this.props.onChange(text);
    },

    // Toggle styles
    toggleBlockType: function(blockType) {
        this.onChange(
            draft.RichUtils.toggleBlockType(this.state.editorState, blockType)
        );
    },
    toggleInlineStyle(inlineStyle) {
        this.onChange(
            draft.RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    },

    componentDidMount: function() {
        this.onChange(this.state.editorState);
    },

    render: function() {
        var editorState = this.state.editorState;

        return <div className="MarkdownEditor">
            <div className="MarkdownEditor-Toolbar">
                <BlockStyleControls
                    editorState={editorState}
                    onToggle={this.toggleBlockType}
                />
                <InlineStyleControls
                    editorState={editorState}
                    onToggle={this.toggleInlineStyle}
                />
            </div>
            <draft.Editor
                blockStyleFn={getBlockStyle}
                editorState={editorState}
                onChange={this.onChange}
                spellCheck={true}
            />
        </div>;
    }
});

var Example = React.createClass({
    getInitialState: function() {
        return {
            content: EXAMPLE_SOURCE
        };
    },

    onEditorChanged: function(content) {
        this.setState({
            content: content
        });
    },

    render: function() {
        return <div className="Example">
            <div className="ExampleEditor">
                <MarkdownEditor content={this.state.content} onChange={this.onEditorChanged} />
            </div>
            <div className="ExamplePreview"><pre>{this.state.content}</pre></div>
        </div>;
    }
});


// Render example application
ReactDOM.render(
    <Example />,
    document.getElementById('target')
);

