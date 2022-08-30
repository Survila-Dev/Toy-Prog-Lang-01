import "./Editor.css"

import React from "react";

const Editor = ({
    editorContent,
    changeEditorContent,
    lineMarking,
    changeLineDragContent
    }) => {

    function resizeEditor() {
        
        const targetTextarea = document.querySelector("textarea");
        const noOfLines = targetTextarea.value.split("\n").length;
        const lineHeightText = window.getComputedStyle(targetTextarea, null)
            .getPropertyValue('line-height');
        const lineHeight = parseFloat(
            lineHeightText.substring(0, lineHeightText.length - 2));

        const EDITORPADDING = 0;

        const editorElement = document.querySelector(".editor");
        const editorElementHeight = editorElement.clientHeight - EDITORPADDING;

        targetTextarea.style.height = `${Math.max(noOfLines * lineHeight, editorElementHeight)}px`;
    }

    React.useEffect(() => {
        window.addEventListener("resize", resizeEditor)
    }, [])

    const lineNumber = editorContent.split("\n").length;
    // const [lineNumber, changeLineNumber] = React.useState(1)

    function handleTextAreaChange(event) {
        changeEditorContent(event.target.value)
        resizeEditor();
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
    const backgroundLinesJSX = []
    for (let i = 1; i <= lineNumber; i++) {
        if (i === lineMarking.currentEvalLine) {
            lineNumbersJSX.push(
                <div
                    className = "eval-line singlelinenumber"
                    key = {i}
                    id = {i}
                    draggable = "true"
                    onDragStart = {handleDragStart}
                    onDragEnd = {handleDragEnd}
                >
                    {i}
                </div>)

            backgroundLinesJSX.push(
                <div
                    className = "editor__background-line_eval editor__background-line"
                    id = {i} key = {i}
                >{i}</div>
                )

        } else if (i === lineMarking.currentErrorLine) {
            lineNumbersJSX.push(
                <div
                    className = "error-line singlelinenumber"
                    key = {i}
                    id = {i}
                    draggable = "true"
                    onDragStart = {handleDragStart}
                    onDragEnd = {handleDragEnd}
                >
                    {i}
                    <span className = "editor__line_background"></span>
                </div>)

            backgroundLinesJSX.push(
                <div
                    className = "editor__background-line_error editor__background-line"
                    id = {i} key = {i}
                >{i}</div>)

        } else {
            lineNumbersJSX.push(
                <div
                    className = "singlelinenumber"
                    key = {i}
                    id = {i}
                    draggable = "true"
                    onDragStart = {handleDragStart}
                    onDragEnd = {handleDragEnd}
                >
                    {i}
                </div>)

            backgroundLinesJSX.push(
                <div
                    className = "editor__background-line"
                    id = {i} key = {i}
                >{i}</div>)
        }
    }
    console.log(backgroundLinesJSX.length)


    return (
        <div className = "editor">
            <div className ="linenumbers">
                {lineNumbersJSX}
            </div>
            <textarea
                defaultValue = {editorContent}
                onChange = {handleTextAreaChange}>
            </textarea>
        </div>
    )
}

export default Editor;