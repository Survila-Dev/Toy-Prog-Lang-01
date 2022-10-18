import * as flSuperModule from "./FLNodeSuper";
import * as flExpModule from "./FLNodeExpression";
import { stringIgnoringTags, stringSplitIgnoringTags } from "../splitString";
import { FLNodeAssignment } from "../../dist/FLNode/FLNodeAssignment";

enum ConditionalType {
    equal = "equal",
    larger = "larger",
    lower = "lower",
    largerEqual = "largerEqual",
    lowerEqual = "lowerEqual",
    boolean = "boolean",
    unequal = "unequal",
    not = "not",
    and = "and",
    or = "or"
}

export class FLNodeConditional extends flSuperModule.FLNode {

    conditionalType: ConditionalType;
    conditionalSymbol: string | null;

    static syntaxSymbols = {
        equal: "==",
        larger: ">",
        lower: "<",
        largerEqual: ">=",
        lowerEqual: "<=",
        unequal: "!=",
        not: "!",
        and: "&",
        or: "|"
    };
    
    constructor(
        type: flSuperModule.FLNodeTypeEnum,
        text: flSuperModule.BlockTextInterface,
        nodeLine?: number) {

        super(type, text);
        if (nodeLine) {
            this.nodeLine = nodeLine;
        }

        // Remove enclosure if the wrap the whole this.text

        if (stringIgnoringTags(
            this.text,
            flExpModule.FLNodeExpression.syntaxSymbols.enclosureStart,
            flExpModule.FLNodeExpression.syntaxSymbols.enclosureEnd).length === 0) {
                this.text = this.text.substring(1, this.text.length - 1);
            };

        this.createChildren();
    }

    // Create children
    createChildren(): flSuperModule.FLNodeInterface[] {

        // Check the conditional type
        const textExcludingEnclosures = stringIgnoringTags(
            this.text,
            flExpModule.FLNodeExpression.syntaxSymbols.enclosureStart,
            flExpModule.FLNodeExpression.syntaxSymbols.enclosureEnd)

        // add !, and, or
        if (textExcludingEnclosures.includes(FLNodeConditional.syntaxSymbols.unequal)) {
            this.conditionalType = ConditionalType.unequal;
            this.conditionalSymbol = FLNodeConditional.syntaxSymbols.unequal

        } else if (textExcludingEnclosures.includes(FLNodeConditional.syntaxSymbols.not)) {
            this.conditionalType = ConditionalType.not;
            this.conditionalSymbol = FLNodeConditional.syntaxSymbols.not

        } else if (textExcludingEnclosures.includes(FLNodeConditional.syntaxSymbols.and)) {
            this.conditionalType = ConditionalType.and;
            this.conditionalSymbol = FLNodeConditional.syntaxSymbols.and

        } else if (textExcludingEnclosures.includes(FLNodeConditional.syntaxSymbols.or)) {
            this.conditionalType = ConditionalType.or;
            this.conditionalSymbol = FLNodeConditional.syntaxSymbols.or

        // other conditional tokens
        } else if (this.text.includes(FLNodeConditional.syntaxSymbols.largerEqual)) {
            this.conditionalType = ConditionalType.largerEqual;
            this.conditionalSymbol = FLNodeConditional.syntaxSymbols.largerEqual

        } else if (this.text.includes(FLNodeConditional.syntaxSymbols.lowerEqual)) {
            this.conditionalType = ConditionalType.lowerEqual;
            this.conditionalSymbol = FLNodeConditional.syntaxSymbols.lowerEqual

        } else if (this.text.includes(FLNodeConditional.syntaxSymbols.equal)) {
            this.conditionalType = ConditionalType.equal;
            this.conditionalSymbol = FLNodeConditional.syntaxSymbols.equal

        } else if (this.text.includes(FLNodeConditional.syntaxSymbols.larger)) {
            this.conditionalType = ConditionalType.larger;
            this.conditionalSymbol = FLNodeConditional.syntaxSymbols.larger

        } else if (this.text.includes(FLNodeConditional.syntaxSymbols.lower)) {
            this.conditionalType = ConditionalType.lower;
            this.conditionalSymbol = FLNodeConditional.syntaxSymbols.lower

        } else if (this.text.includes(FLNodeConditional.syntaxSymbols.unequal)) {
            this.conditionalType = ConditionalType.unequal;
            this.conditionalSymbol = FLNodeConditional.syntaxSymbols.unequal

        // defaulting to boolean variable
        } else {
            this.conditionalType = ConditionalType.boolean;
            this.conditionalSymbol = null;
        }

        const enclosureStartSymbol = flExpModule.FLNodeExpression.syntaxSymbols.enclosureStart;
        const enclosureEndSymbol = flExpModule.FLNodeExpression.syntaxSymbols.enclosureEnd;

        // If only boolean create one child
        if (this.conditionalType === ConditionalType.boolean) {

            const onlyChild = new flExpModule.FLNodeExpression(
                flSuperModule.FLNodeTypeEnum.Expression,
                this.text
            )
            this.children = [onlyChild];
            return this.children;

        } else if (this.conditionalType === ConditionalType.not){

            const childText = stringSplitIgnoringTags(
                this.text,
                this.conditionalSymbol as string,
                [[enclosureStartSymbol, enclosureEndSymbol]]
            )[1]

            const onlyChild = new FLNodeConditional(
                flSuperModule.FLNodeTypeEnum.Conditional,
                childText
            )

            this.children = [onlyChild]
            return this.children
        
        } else {
            // Divide to left and right child while ignoring the enclosure symbols
            if (!(this.conditionalSymbol)) {
                throw "No conditional symbol found."
            }

            const childrenText = stringSplitIgnoringTags(
                this.text,
                this.conditionalSymbol as string,
                [[enclosureStartSymbol, enclosureEndSymbol]]
            )

            this.children = childrenText.map((childText) => {
                return new FLNodeConditional(
                    flSuperModule.FLNodeTypeEnum.Conditional,
                    childText
                )
            })

            if (this.children.length !== 2) {
                throw "Not possible to evaluate conditional statement."
            }

            return this.children
        }
    }

    run(scopeEnvironment: object): [unknown, string] {

        

        // Execute the children and give either 1 or 0 for boolean value

        if (this.children.length === 1) {
            switch(this.conditionalType) {
                case ConditionalType.boolean:
                    return (this.children[0].run(scopeEnvironment));
                    break;

                case ConditionalType.not:

                    const outValue = this.children[0].run(scopeEnvironment)[0];
                    
                    if (outValue === "true") {
                        return ([1, ""]);
                    } else if (outValue === "false") {
                        return ([0, ""]);
                    }

                    if (convertToBoolean(outValue)) {
                        return ([0, ""])
                    } else if (outValue === 0) {
                        return ([1, ""])
                    }
                    break;
                }

        } else {

            const leftChildValue = this.children[0].run(scopeEnvironment)[0];
            const rightChildValue = this.children[1].run(scopeEnvironment)[0];

            let outputValue: boolean;

            switch(this.conditionalType) {

                case ConditionalType.or:
                    outputValue = convertToBoolean(leftChildValue) || convertToBoolean(rightChildValue);
                    break;
                case ConditionalType.and:
                    outputValue = convertToBoolean(leftChildValue) && convertToBoolean(rightChildValue);
                    break;
                case ConditionalType.equal:
                    outputValue = leftChildValue == rightChildValue;
                    break;
                case ConditionalType.unequal:
                    outputValue = leftChildValue != rightChildValue;
                    break;
                case ConditionalType.largerEqual:
                    outputValue = leftChildValue >= rightChildValue;
                    break;
                case ConditionalType.lowerEqual:
                    outputValue = leftChildValue <= rightChildValue;
                    break;
                case ConditionalType.larger:
                    outputValue = leftChildValue > rightChildValue;
                    break;
                case ConditionalType.lower:
                    outputValue = leftChildValue < rightChildValue;
                    break;
                default:
                    throw "Conditional value could not be evaluated."
            }

            if (outputValue) {
                return ([1, ""]);
            } else {
                return ([0, ""]);
            }

        }

        return ([,""]);
    }

    runOneStep(
        inputCurrentLine: number,
        inputScopeEnvironment: object,
        inputCallStack: string[]) {

        if (this.runCycleStatus === flSuperModule.RunCycleStatusEnum.evaluate) {
            this.runCycleStatus = flSuperModule.RunCycleStatusEnum.popOffStack;
            
            return {
                currentLine: this.nodeLine,
                scopeEnvironment: inputScopeEnvironment,
                callStack: inputCallStack,
                output: null}
        } 

        const outputCallStack = flSuperModule.genericStateChange(
            this, inputCallStack)
        
        return ({
            currentLine: this.nodeLine,
            scopeEnvironment: inputScopeEnvironment,
            callStack: outputCallStack,
            output: null})
    }
}

export function convertToBoolean(value: number) {
    if (parseInt(value as unknown as string) === 1) {
        return true
    } else if (parseInt(value as unknown as string) === 0) {
        return false
    } else {
        throw "Not a boolean value to be used for not operator"
    }
}