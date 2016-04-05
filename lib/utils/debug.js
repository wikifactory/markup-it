/* eslint-disable no-console */

// Print an indentation
function getIndentation(indentation) {
    return (new Array(indentation*4 + 1)).join(' ');
}

// Print a list of tokens
function printTokens(tokens, indentation) {
    tokens.forEach(function(token) {
        var data = token.getData();

        console.log(
            getIndentation(indentation),
            '#' + token.getType(),
            JSON.stringify(token.getText())
        );

        if (data.size > 0) {
            console.log(
                getIndentation(indentation + 1),
                JSON.stringify(data.toJS())
            );
        }


        printTokens(token.getTokens(), indentation + 1);
    });
}

// Print a Content instance
function printContent(content) {
    printTokens(content.getTokens(), 0);
}

module.exports = {
    printTokens: printTokens,
    printContent: printContent
};
