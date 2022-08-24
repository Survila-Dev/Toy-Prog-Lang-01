import React from "react";

const Editor = ({
    editorContent,
    changeEditorContent,
    lineMarking,
    changeLineDragContent
    }) => {

    const lineNumber = editorContent.split("\n").length;
    // const [lineNumber, changeLineNumber] = React.useState(1)

    function handleTextAreaChange(event) {
        changeEditorContent(event.target.value)
    }

    function handleDragStart(event) {
        const i = event.target.id
        changeLineDragContent([`Line ${i}`, editorContent.split("\n")[i - 1]])
    }

    function handleDragEnd(event) {
        changeLineDragContent(["", ""])
    }

    // currentEvalLine: 4,
    // currentErrorLine

    const lineNumbersJSX = []
    for (let i = 1; i <= lineNumber; i++) {
        if (i === lineMarking.currentEvalLine) {
            lineNumbersJSX.push(
                <div
                    className = {"EvalLine"}
                    key = {i}
                    id = {i}
                    draggable = "true"
                    onDragStart = {handleDragStart}
                    onDragEnd = {handleDragEnd}
                >
                    {i}
                </div>)

        } else if (i === lineMarking.currentErrorLine) {
            lineNumbersJSX.push(
                <div
                    className = {"ErrorLine"}
                    key = {i}
                    id = {i}
                    draggable = "true"
                    onDragStart = {handleDragStart}
                    onDragEnd = {handleDragEnd}
                >
                    {i}
                </div>)

        } else {
            lineNumbersJSX.push(
                <div
                    className = "SingleLineNumber"
                    key = {i}
                    id = {i}
                    draggable = "true"
                    onDragStart = {handleDragStart}
                    onDragEnd = {handleDragEnd}
                >
                    {i}
                </div>)
        }
    }


    return (
        <>
            <div className ="LineNumbers">
                {lineNumbersJSX}
            </div>
            <textarea
                defaultValue = {editorContent}
                onChange = {handleTextAreaChange}>
            </textarea>
            {lineNumber}
        </>
    )
}

export default Editor;