import "./Output.css"

import React from "react";

function Output({outputList, errorsInList}) {

    const lineNoJSX = [];
    const outputTextJSX = [];

    for (let i = 0; i < outputList.length; i++) {
        if (errorsInList[i]) {
            lineNoJSX.push(<div className = "output__line-no_error" key = {i+1}>{i + 1}</div>)
            outputTextJSX.push(<div className = "output__line_error" key = {i+1}>{outputList[i]}</div>)
        } else {
            lineNoJSX.push(<div className = "output__line-no" key = {i+1}>{i + 1}</div>)
            outputTextJSX.push(<div key = {i+1}>{outputList[i]}</div>)
        } 
    }

    return (
        <div className = "output">
            <div className = "outputlinenumber">
                {lineNoJSX}
            </div>
            <div className = "outputtext" data-testid = "output-field">
                {outputTextJSX}
            </div>
        </div>
    )
}

export default Output;