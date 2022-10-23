import "./Editor.css"

import React from "react";

const Editor = ({
    editorContent,
    changeEditorContent,
    lineMarking,
    changeLineDragContent,
    intervalObj,
    updateInterpretatorState
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

        // Resize the syntax helper button
        const scrollBarWidth = document.querySelector(".editor").offsetWidth - 
                                document.querySelector(".editor").clientWidth;

        console.log("Scroll bar width:")
        console.log(scrollBarWidth);

        document.querySelector(".editor__syntax-helper_button").style.right = (18 + scrollBarWidth) + "px";
        document.querySelector(".editor__syntax-helper_button").style.top = "154px";

        document.querySelector(".editor__syntax-helper").style.right = (18 + scrollBarWidth) + "px"; 
        document.querySelector(".editor__syntax-helper").style.top = (154 + 28) + "px";

        document.querySelector(".editor__syntax-helper").style.height = (editorElementHeight-28)+"px";

    }

    React.useEffect(() => {
        window.addEventListener("resize", resizeEditor)
    }, [])

    const [displayHelper, updateDisplayHelper] = React.useState(false);

    const textAreaRef = React.useRef();

    const lineNumber = editorContent.split("\n").length;
    // const [lineNumber, changeLineNumber] = React.useState(1)

    function textAreaChange(value) {

        changeEditorContent(value)
        resizeEditor();

        clearInterval(intervalObj);
        updateInterpretatorState((prevState) => {
            const newCode = prevState.currentCode;
            newCode.internalText = value;
            // console.log(newCode.internalText);
            return {
                ...prevState,
                globalStack: [],
                currentCode: newCode,
                lineMarking: {currentEvalLine: null, currentErrorLine: null},
            }  
        })
    }

    function handleTextAreaChange(event) {

        // textAreaChange(event.target.value);
        changeEditorContent(event.target.value)
        resizeEditor();

        clearInterval(intervalObj);
        updateInterpretatorState((prevState) => {
            const newCode = prevState.currentCode;
            newCode.internalText = event.target.value;
            return {
                ...prevState,
                globalStack: [],
                currentCode: newCode,
                lineMarking: {currentEvalLine: null, currentErrorLine: null},
            }  
        })
    }

    function handleDragStart(event) {
        const i = event.target.id
        changeLineDragContent([`Line ${i}`, editorContent.split("\n")[i - 1]])
    }

    function handleDragEnd(event) {
        changeLineDragContent(["", ""])
    }

    function handleTabPress(event) {
        const textAreaElement = document.querySelector("textarea");
        const start = textAreaElement.selectionStart;
        const end = textAreaElement.selectionEnd;

        if (event.key === "Tab") {
            event.preventDefault()
            if (textAreaRef.current) {
                const cursorPosition = start + 1;
                textAreaRef.current.value = textAreaRef.current.value.substring(0, start) + "\t" + textAreaRef.current.value.substring(end);
                textAreaRef.current.setSelectionRange(cursorPosition, cursorPosition)

                textAreaChange(textAreaRef.current.value)
            }

        } else if (event.key === "Enter") {
            event.preventDefault();

            // count the tabs from previous lines
            const lineTexts = textAreaRef.current.value.split("\n");
            let curPos = 0;
            let curLine = null;
            for (let i = 0; i < lineTexts.length; i++) {
                curPos += lineTexts[i].length + 2;
                if (curPos > start) {
                    curLine = i;
                    break;
                } else {
                    curLine = i + 1;
                }
            }

            // insert the required amount of tab escape strings before new line
            const noOfTabsInPrevLine = lineTexts[curLine].split("\t").length - 1;

            let insertString = "\n"
            for (let i = 0; i < noOfTabsInPrevLine; i++) {
                insertString += "\t"
            }
            textAreaRef.current.value = textAreaRef.current.value.substring(0, start)
                + insertString + textAreaRef.current.value.substring(end);
            
            const cursorPos = start + insertString.length;
            textAreaRef.current.setSelectionRange(cursorPos, cursorPos);
            resizeEditor();
            textAreaChange(textAreaRef.current.value);
            
        }
        
    }

    function handleHelperClick(event) {
        

        if (displayHelper) {
            // Set width of button to auto
            document.getElementsByClassName("editor__syntax-helper_button")[0].style.width = "auto";
            document.querySelector(".editor__syntax-helper").style.visibility = "hidden";
        } else {
            // Set width to the width to a given varialbe
            document.getElementsByClassName("editor__syntax-helper_button")[0].style.width = "calc(var(--editor-helper-width) + 20px)";
            document.querySelector(".editor__syntax-helper").style.visibility = "visible";
        }

        updateDisplayHelper((prevVal) => !prevVal)
        resizeEditor();
    }

    const lineNumbersJSX = []
    const backgroundLinesJSX = []
    for (let i = 1; i <= lineNumber; i++) {
        if (i === lineMarking.currentErrorLine) {
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

        } else if (i === lineMarking.currentEvalLine) {
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


    return (
        <div className = "editor">
            <button className = "editor__syntax-helper_button" onClick = {handleHelperClick}>SYNTAX GUIDE</button>
            <div className ="linenumbers">
                {lineNumbersJSX}
            </div>
            <textarea
                ref = {textAreaRef}
                value = {editorContent}
                onChange = {handleTextAreaChange}
                onKeyDown = {handleTabPress}>
            </textarea>
            <div className = "editor__syntax-helper">
                <h3>1. Variables</h3>
                <p className = "editor__helper__text">Assignment:</p>
                <p className = "editor__helper__syntax">var = 25;</p>
                <p className = "editor__helper__text">Number arithmetic operations:</p>
                <p className = "editor__helper__syntax">+, -, /, *</p>

                <p className = "editor__helper__text">String concat:</p>
                <p className = "editor__helper__syntax">+</p>

                <p className = "editor__helper__text">Boolean operations:</p>
                <p className = "editor__helper__syntax">
                    not !; and &, or |, equal ==,
                    larger {">"}, larger or equal {">="}, lasser {">"}, lesser or equal {"<="}
                </p>

                <h3>2. Control structures</h3>
                <p className = "editor__helper__text">If structure:</p>
                <p className = "editor__helper__syntax">IF (boolean) {"{code};"}</p>
                <p className = "editor__helper__syntax">IF (condition) {"{code};"} ELSE {"{code};"}</p>
                <p className = "editor__helper__text">While loop:</p>
                <p className = "editor__helper__syntax">WHILE (condition) {"{code};"}</p>
                <p className = "editor__helper__text">For loop:</p>
                <p className = "editor__helper__syntax">FOR (intialization | condition | iteration) {"{code};"}</p>
                
            </div>
            
        </div>
    )
}

export default Editor;