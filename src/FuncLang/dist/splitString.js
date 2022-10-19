"use strict";
exports.__esModule = true;
exports.stringIgnoringTags = exports.stringSplitIgnoringTags = void 0;
function stringSplitIgnoringTags(inputString, splitSymbol, pairsOfTags) {
    var splitStrings = [""];
    // tagStack of strings to know, which to pop
    var tagStack = [];
    function checkForTagsAtPosition(position) {
        // the first string literal is the found tag and the second its pair
        // iterate through the start tags
        var noOfTagPairs = pairsOfTags.length;
        for (var i = 0; i < noOfTagPairs; i++) {
            var curTag = pairsOfTags[i][0];
            if (inputString.substring(position, position + curTag.length) === curTag) {
                return ["start", curTag, pairsOfTags[i][1]];
            }
        }
        // iterate through the end tags
        for (var i = 0; i < noOfTagPairs; i++) {
            var curTag = pairsOfTags[i][1];
            if (inputString.substring(position, position + curTag.length) === curTag) {
                return ["end", curTag, pairsOfTags[i][0]];
            }
        }
        return false;
    }
    try {
        // // Iterate through the string
        for (var i = 0; i < inputString.length; i++) {
            // Check for all the tags (starting and ending)
            var foundTag = checkForTagsAtPosition(i);
            if (foundTag) {
                // If starting tag found
                if (foundTag[0] === "start") {
                    // Add it to stack and start ignoring symbols; add to i
                    tagStack.push([foundTag[1], foundTag[2]]);
                    splitStrings[splitStrings.length - 1] += foundTag[1];
                }
                else if (foundTag[0] === "end") {
                    // If ending tag found, pop the element from stack or give error
                    if (foundTag[1] === tagStack[tagStack.length - 1][1]) {
                        tagStack.pop();
                        splitStrings[splitStrings.length - 1] += foundTag[1];
                    }
                    else {
                        throw "Wrong ending tags";
                    }
                }
                i += foundTag[1].length;
                if (i >= inputString.length) {
                    break;
                }
            }
            // if tag stack empty, start looking looking for elements to split; add to i
            if (tagStack.length === 0) {
                // If tag stack empty, check if split symbol reach
                var seperatorSize = splitSymbol.length;
                if (splitSymbol === inputString.substring(i, i + seperatorSize)) {
                    splitStrings.push("");
                    i += seperatorSize - 1;
                    if (i >= inputString.length) {
                        break;
                    }
                }
                else {
                    splitStrings[splitStrings.length - 1] += inputString[i];
                }
                // if split symbol is there, start another string
            }
            else {
                splitStrings[splitStrings.length - 1] += inputString[i];
            }
        }
    }
    catch (error) {
        throw "Not able to parse the code.";
    }
    return splitStrings;
}
exports.stringSplitIgnoringTags = stringSplitIgnoringTags;
function stringIgnoringTags(inputString, startTag, endTag) {
    var tagStacks = 0;
    var outputString = "";
    for (var i = 0; i < inputString.length; i++) {
        if (inputString[i] === startTag) {
            tagStacks++;
        }
        else if (inputString[i] === endTag) {
            tagStacks--;
            continue;
        }
        ;
        if (tagStacks === 0) {
            outputString += inputString[i];
        }
    }
    return outputString;
}
exports.stringIgnoringTags = stringIgnoringTags;
