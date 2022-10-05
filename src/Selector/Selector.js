import "./Selector.css"
import dropdownIcon from "./1063883_arrow_arrow down_down_drop_stroke arrow_icon.svg"
import { FLCode } from "../FuncLang/dist/FLCode"

import React from "react";

function Selector({updateEditorContent, interpretorState, updateInterpretorState, intervalObj}) {

    const [showOptions, changeShowOptions] = React.useState(false);
    const [optionWidth, changeOptionWidth] = React.useState("70%");
    const [currentSelection, updateCurrentSelection] = React.useState(0)

    React.useEffect(() => {
        document.addEventListener("click", closeAllSelect);
        resizeOptions();
        window.addEventListener("resize", resizeOptions)
    }, [])

    function resizeOptions() {
        const newOptionWidth = document.getElementsByClassName("selectorbutton")[0].offsetWidth;
        changeOptionWidth(newOptionWidth)
    }

    function closeAllSelect(event) {
        const className = event.target.className;

        if (showOptions &&
            className !== "selectorbutton" &&
            className !== "optionarticle" &&
            className !== "clickignore") {
            changeShowOptions(false)
        }
    }

    function handleSelectorClick(event) {
        changeShowOptions((prevState) => !prevState)
        const articleElements = document.getElementsByClassName("optionarticle");
    }

    function handleOptionClick(event) {
        changeShowOptions(false)
        clearInterval(intervalObj)
        console.log("Started the option click")
        // Save current interpretor state to the local storage
        localStorage.setItem(
            `snippet${currentSelection}`,
            JSON.stringify(interpretorState));

        console.log(`snippet${currentSelection}`)
        console.log("Saved the current state to local storage")
        updateCurrentSelection(event.target.id);

        console.log("Updated the current selection value")
        console.log(`snippet${event.target.id}`)

        // Get the new interpretor state from the local storage
        const newValue = JSON.parse(
            localStorage.getItem(
                `snippet${event.target.id}`)
        )

        console.log("Selected value");
        console.log(newValue.currentCode.internalText);
        // newValue.callStack = [];

        updateInterpretorState(
            {
                ...newValue,
                globalStack: [],
                currentCode: new FLCode(newValue.currentCode.internalText, 200),
                lineMarking: {currentEvalLine: null, currentErrorLine: null},
                nominalStackSize: 0,
            });

        // updateInterpretorState((prevState) => {
        //     return {
        //         ...prevState,
        //         globalStack: []
        //     }
        // }
        // )

        updateEditorContent(newValue.currentCode.internalText);

        console.log("Got the new interpretor value from local storage")
    }

    const options = []

    for (let i = 0; i < 3; i++) {
        options.push(
            <article
                className = "optionarticle"
                style = {{width: optionWidth}}
                id = {i}
                key = {i}
                onClick = {handleOptionClick}
            >
                {"Here some text \n \n Text "+i}
            </article>
        )
    }
    return (
        <>
            <div className = "selector">
                <div className = "selectorbutton" onClick = {handleSelectorClick}>
                    <div className = "clickignore">
                        <h2 className = "clickignore">Selector</h2>
                        <p className = "h2_sub clickignore">Select pre-written code snippets</p>
                    </div>
                    <div className = "clickignore select__dropdown-symbol__div">
                        <img className = "clickignore select__dropdown-symbol" src = {dropdownIcon} alt = "v"/>
                    </div>
                </div>
                <div className = "selectoroptions">
                    {showOptions? options : <></>}
                </div>
            </div>
            {showOptions? <div className = "selector__popup-cover"></div> : <></>}
        </>
    )
}

export default Selector;