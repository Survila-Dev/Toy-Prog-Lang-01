import "./CallStack.css"

import React from "react"

function CallStack({
    callStack, changeCallStack, lineDragContent, changeLineDragContent}) {

    function popStackElement(event) {
        const {id} = event.target;
        changeCallStack((prevStack) => {
            const newStack = [...prevStack]
            newStack.splice(id, 1);
            return newStack;
        })
    }

    const callStackJSX = []
    for (let i = 0; i < callStack.length; i++) {
        callStackJSX.push(
            <div
                className = "callstackelement"
                key = {i}
                id = {i}
                onClick = {popStackElement}
            >
                {callStack[i][1]}
            </div>
        )
    }

    function handleDropOfLine(event) {

        console.log("Just fired on drop")

        changeCallStack((prevStack) => {
            const newStack = [...prevStack];
            newStack.push(lineDragContent);
            return newStack;
        })
    }

    function preventDefaultFunc(event) {
        event.preventDefault();
    }

    return (
        <div className = "callstackwithtitle">
            <div>
                <h2>Call Stack</h2>
                <p class="h2_sub">Remove elements or add by dragging line number from editor</p>
            </div>
            <div
                className = "callstack"
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