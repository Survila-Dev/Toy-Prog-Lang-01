import "./CallStack.css"

import React from "react"

function CallStack({
    callStack, changeCallStack, lineDragContent, changeInterpretorState}) {

    function popStackElement(event) {
        const {id} = event.target;
        changeInterpretorState((prevState) => {
            const newStack = [...prevState.globalStack];
            newStack.splice(id, 1);
            return {...prevState, globalStack: newStack}
        })
    }

    const callStackJSX = []
    for (let i = 0; i < callStack.length; i++) {
        callStackJSX.push(
            <div
                className = "callstackelement"
                key = {i}
                id = {i}
            >
                {callStack[i][1]}
            </div>
        )
    }

    function handleDropOfLine(event) {

        console.log("Just fired on drop")
        changeInterpretorState((prevState) => {
            const newStack = [...prevState.globalStack];
            newStack.push(lineDragContent);
            return {...prevState, globalStack: newStack}
        })
    }

    function preventDefaultFunc(event) {
        event.preventDefault();
    }

    return (
        <div className = "callstackwithtitle">
            <div>
                <h2>Call Stack</h2>
                <p className="h2_sub">Add by dragging line number from editor</p>
            </div>
            <div
                className = "callstack"
                data-testid = "callstack"
                onDrop = {handleDropOfLine}
                onDragOver = {preventDefaultFunc}
                onDragEnter = {preventDefaultFunc}
            >
                {callStackJSX}
            </div>
        </div>
    );
}

export default CallStack;