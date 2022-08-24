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
        callStackJSX.unshift(
            <div
                className = "CallStackElement"
                key = {i}
                id = {i}
                onClick = {popStackElement}
            >
                {callStack[i][0]}
                {" "}
                {callStack[i][1 ]}
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
        <div
            className = "CallStack"
            onDrop = {handleDropOfLine}
            onDragOver = {preventDefaultFunc}
            onDragEnter = {preventDefaultFunc}
        >
            {callStackJSX}
        </div>
    );
}

export default CallStack;