var React = require('react');
var ReactDOM = require('react-dom');
var draft = require('draft-js');

var DraftMarkup = require('../');
var markdown = require('../rules/markdown');

var INLINE_STYLES = [
    { label: 'Bold', style: DraftMarkup.INLINES.BOLD },
    { label: 'Italic', style: DraftMarkup.INLINES.ITALIC },
    { label: '~', style: DraftMarkup.INLINES.STRIKETHROUGH },
    { label: 'Code', style: DraftMarkup.INLINES.CODE }
];

var BLOCK_TYPES = [
    { label: 'H1', style: DraftMarkup.BLOCKS.HEADING_1 },
    { label: 'H2', style: DraftMarkup.BLOCKS.HEADING_2 },
    { label: 'H3', style: DraftMarkup.BLOCKS.HEADING_3 },
    { label: 'H4', style: DraftMarkup.BLOCKS.HEADING_4 },
    { label: 'H5', style: DraftMarkup.BLOCKS.HEADING_5 },
    { label: 'H6', style: DraftMarkup.BLOCKS.HEADING_6 },
    { label: 'Blockquote', style: DraftMarkup.BLOCKS.BLOCKQUOTE },
    { label: 'UL', style: DraftMarkup.BLOCKS.UL },
    { label: 'OL', style: DraftMarkup.BLOCKS.OL },
    { label: 'Code Block', style: DraftMarkup.BLOCKS.CODE },
];


// Return className for a block
function getBlockStyle(block) {
    return 'MarkdownEditor-block MarkdownEditor-' + block.getType();
}

// Create draft-text instance
var draftMarkup = new DraftMarkup(markdown);

// Entities and custom blocks
var Link = React.createClass({
    render: function() {
        var data = draft.Entity.get(this.props.entityKey).getData();
        return <a href={data.href} className="MarkdownEditor-link">{this.props.children}</a>;
    }
});
var Image = React.createClass({
    render: function() {
        var data = draft.Entity.get(this.props.entityKey).getData();
        return <img className="MarkdownEditor-img" src={data.src} />;
    }
});
var HR = React.createClass({
    render: function() {
        return <hr className="MarkdownEditor-hr"/>;
    }
});

function findEntity(type) {
    return function(contentBlock, callback) {
        contentBlock.findEntityRanges(function(character) {
            var entityKey = character.getEntity();
            return (entityKey !== null && draft.Entity.get(entityKey).getType() === type);
        }, callback);
    };
}

function blockRenderer(contentBlock) {
    var type = contentBlock.getType();
    if (type === DraftMarkup.BLOCKS.HR) {
        return {
            component: HR
        };
    }
}

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
        var decorator = new draft.CompositeDecorator([
            {
                strategy: findEntity('hr'),
                component: HR,
            },
            {
                strategy: findEntity('link'),
                component: Link,
            },
            {
                strategy: findEntity('image'),
                component: Image,
            }
        ]);

        var rawContent = draftMarkup.toRawContent(this.props.content);

        var blocks = draft.convertFromRaw(rawContent);
        var content = draft.ContentState.createFromBlockArray(blocks);
        var editorState = draft.EditorState.createWithContent(content, decorator);

        return {
            editorState: editorState
        };
    },

    // Draft's editor content changed
    onChange: function(editorState) {
        console.log('content changed');

        var content = editorState.getCurrentContent();
        var rawContent = draft.convertToRaw(content);
        var text = draftMarkup.toText(rawContent);

        this.setState({
            editorState: editorState
        });

        if (this.props.onChange) this.props.onChange(text, rawContent);
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
            <div className="MarkdownEditor-EditArea">
                <draft.Editor
                    blockStyleFn={getBlockStyle}
                    editorState={editorState}
                    blockRendererFn={blockRenderer}
                    onChange={this.onChange}
                    spellCheck={true}
                />
            </div>
        </div>;
    }
});

module.exports = MarkdownEditor;

