export function stringSplitIgnoringTags(
    inputString: string,
    splitSymbol: string,
    pairsOfTags: [string, string][]
    ): string[] {

        const splitStrings: string[] = [""];

        // tagStack of strings to know, which to pop
        let tagStack: [string,string][] = [];

        function checkForTagsAtPosition(position): [string,string,string] | boolean {

            // the first string literal is the found tag and the second its pair
            // iterate through the start tags
            const noOfTagPairs = pairsOfTags.length;

            for (let i = 0; i < noOfTagPairs; i++) {
                const curTag = pairsOfTags[i][0];
                if (inputString.substring(position,position+curTag.length) === curTag) {
                    return ["start", curTag, pairsOfTags[i][1]];
                }
            }

            // iterate through the end tags
            for (let i = 0; i < noOfTagPairs; i++) {
                const curTag = pairsOfTags[i][1];
                if (inputString.substring(position,position+curTag.length) === curTag) {
                    return ["end", curTag, pairsOfTags[i][0]];
                }
            }

            return false;
        }

        try {
        // // Iterate through the string
        for (let i = 0; i < inputString.length; i++) {

            

            // Check for all the tags (starting and ending)
            const foundTag = checkForTagsAtPosition(i);
            if (foundTag) {
  
                // If starting tag found
                if (foundTag[0] === "start") {
                    // Add it to stack and start ignoring symbols; add to i
                    tagStack.push([foundTag[1], foundTag[2]]);
                    splitStrings[splitStrings.length - 1] += foundTag[1]

                } else if (foundTag[0] === "end") {
                    // If ending tag found, pop the element from stack or give error
                    if (foundTag[1] === tagStack[tagStack.length - 1][1]) {
                        tagStack.pop();
                        splitStrings[splitStrings.length - 1] += foundTag[1]
                    } else {
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
                const seperatorSize = splitSymbol.length;
                if (splitSymbol === inputString.substring(i, i+seperatorSize)) {
                    splitStrings.push("")
                    i += seperatorSize - 1;
                    if (i >= inputString.length) {
                        break;
                    }
                } else {
                    splitStrings[splitStrings.length - 1] += inputString[i]
                }

                // if split symbol is there, start another string
            } else {
                splitStrings[splitStrings.length - 1] += inputString[i]
            }
        }
        } catch(error) {
            throw "Not able to parse the code."
            
        }

        return splitStrings;
    }

export function stringIgnoringTags(
    inputString: string,
    startTag: string,
    endTag: string): string {

        let tagStacks: number = 0;
        let outputString: string = "";

        for (let i: number = 0; i<inputString.length; i++) {
            if (inputString[i] === startTag) {
                tagStacks++;
            } else if (inputString[i] === endTag) {
                tagStacks--;
                continue;
            };

            if (tagStacks === 0) {
                outputString += inputString[i];
            }
        }

        return outputString;
}