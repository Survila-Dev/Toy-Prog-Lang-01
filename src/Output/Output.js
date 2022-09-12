import "./Output.css"

import React from "react";

function Output({outputList}) {

    console.log(outputList[0])

    // Generate the list of divs for numbers
    const lineNoJSX = [];

    // Generate the list of divs for output text
    const outputTextJSX = [];

    for (let i = 0; i < outputList.length; i++) {
        lineNoJSX.push(<div>{i + 1}</div>)
        outputTextJSX.push(<div>{outputList[i]}</div>)
    }

    return (
        <div className = "output">
            <div className = "outputlinenumber">
                {lineNoJSX}
            </div>
            <div className = "outputtext">
                {outputTextJSX}
            </div>
        </div>
    )
}

export default Output;