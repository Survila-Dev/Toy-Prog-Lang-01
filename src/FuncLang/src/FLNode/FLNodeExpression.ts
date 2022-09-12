import * as flSuperModule from "./FLNodeSuper";
import { stringIgnoringTags, stringSplitIgnoringTags } from "../splitString";

export class FLNodeExpression extends flSuperModule.FLNode {

    static syntaxSymbols = {
        enclosureStart: "(",
        enclosureEnd: ")",
        plus: "+",
        minus: "-",
        multiplication: "*",
        division: "/"
    };

    expressionSymbol: string;

    constructor(
        type: flSuperModule.FLNodeTypeEnum,
        text: flSuperModule.BlockTextInterface) {

            super(type, text);
            this.expressionSymbol = "no";

            // Remove enclosure if the wrap the whole this.text

            if (stringIgnoringTags(
                this.text,
                FLNodeExpression.syntaxSymbols.enclosureStart,
                FLNodeExpression.syntaxSymbols.enclosureEnd).length === 0) {
                    this.text = this.text.substring(1, this.text.length - 1);
                };
            
            this.reCheckType();
            this.children = this.createChildren();
        };

    reCheckType(): void {

        const textIgnoreEnclosure = stringIgnoringTags(
            this.text,
            FLNodeExpression.syntaxSymbols.enclosureStart,
            FLNodeExpression.syntaxSymbols.enclosureEnd);

        if (this.type === flSuperModule.FLNodeTypeEnum.Expression) {
            
            if (textIgnoreEnclosure.includes(
                FLNodeExpression.syntaxSymbols.plus)) {
                    this.type = flSuperModule.FLNodeTypeEnum.PlusExp;
                    this.expressionSymbol = "+";

            } else if (textIgnoreEnclosure.includes(
                FLNodeExpression.syntaxSymbols.minus)) {
                    this.type = flSuperModule.FLNodeTypeEnum.MinusExp;
                    this.expressionSymbol = "-";

            } else if (textIgnoreEnclosure.includes(
                FLNodeExpression.syntaxSymbols.multiplication)) {
                    this.type = flSuperModule.FLNodeTypeEnum.MinusExp;
                    this.expressionSymbol = "*";

            } else if ((textIgnoreEnclosure.includes(
                FLNodeExpression.syntaxSymbols.division))) {
                    this.type = flSuperModule.FLNodeTypeEnum.DivisionExp;
                    this.expressionSymbol = "/";
            } 

        }
    }

    createChildren(): flSuperModule.FLNodeInterface[] {

        if (this.expressionSymbol === "no") {
            return [];
            
        } else {

            const childrenText = stringSplitIgnoringTags(
                this.text,
                this.expressionSymbol,
                [[FLNodeExpression.syntaxSymbols.enclosureStart,
                FLNodeExpression.syntaxSymbols.enclosureEnd]]
            )

            const childrenOutput = childrenText.map((childText) => {
                return new FLNodeExpression(
                    flSuperModule.FLNodeTypeEnum.Expression,
                    childText,
                );
            })

        return childrenOutput;
        }
    }

    run(scopeEnvironment: object): [unknown, string]{

        let childrenRunResult: number[];

        if (this.expressionSymbol !== "no") {
            childrenRunResult = this.children.map((currentChild) => 
            {
                return currentChild.run(scopeEnvironment)[0]
            })
        }

        switch(this.expressionSymbol) {
            case "no":
                if (parseFloat(this.text)) {
                    return [parseFloat(this.text), ""];
                } else {
                    return [scopeEnvironment[this.text], ""]
                }
                break;
            case "+":
                // make numbers add before string
                
                return [childrenRunResult.reduce((partialRes, a) => {
                    if (!isNaN(partialRes) && !isNaN(a)) {
                        return (parseFloat(partialRes as unknown as string) + parseFloat(a as unknown as string))
                    } else {
                        return partialRes + a
                    }
                    }
                    ), ""];
                break;
            case "-":
                return [childrenRunResult.reduce((partialRes, a) => partialRes - a), ""];
                break;
            case "*":
                return [childrenRunResult.reduce((partialRes, a) => partialRes * a), ""];
                break;
            case "/":
                return [childrenRunResult.reduce((partialRes, a) => partialRes / a), ""];
                break;
        }
    };

    }