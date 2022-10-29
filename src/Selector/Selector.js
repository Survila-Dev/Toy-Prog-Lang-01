import "./Selector.css"
import dropdownIcon from "./1063883_arrow_arrow down_down_drop_stroke arrow_icon.svg"
import { FLCode } from "../FuncLang/dist/FLCode"
import snippetImage from "./example_gif.gif";

import React from "react";

function Selector({updateEditorContent, interpretorState, updateInterpretorState, intervalObj, updateCodeInAutoRun}) {

    const [showOptions, changeShowOptions] = React.useState(false);
    const [optionWidth, changeOptionWidth] = React.useState("70%");
    const [optionSelectorHeight, updateOptionSelectorHeight] = React.useState(0.8 * window.innerHeight)
    const [currentSelection, updateCurrentSelection] = React.useState(0)
    const [options, updateOptions] = React.useState([]);

    React.useEffect(() => {
        document.addEventListener("click", closeAllSelect);
        resizeOptions();
        window.addEventListener("resize", resizeOptions)

        // Create options from local storage
        updateOptions(() => {

            const optionsReturn = [];
            for (let i = 0; i < 10; i++) {
                const curSnippet = JSON.parse(localStorage.getItem(`snippet${i}`));
                if (curSnippet === null) {
                    break;
                } else {
                    optionsReturn.push(JSON.parse(localStorage.getItem(`snippet${i}`)));
                }
            }
            return optionsReturn;

        })
    }, [])

    const optionsJSX = options.map((item, i) => {
        return (
            <article
                className = "option_article"
                data-testid = "selector-article"
                id = {i}
                key = {i}
                onClick = {handleOptionClick}
                
            >
                <div className = "option-article_content">

                    <div>
                        <h3>{"Snippet " + (i+1) + " - " + item.name}</h3>
                        <p>{item.description}</p>
                    </div>

                    <div className = "option-article_tags">
                        {item.tags.map((itemSub, j) => {
                            return <div id = {j + 10} key = {j + 10}>{itemSub}</div>
                        })}
                    </div>

                </div>
            </article>
        )
    })

    function resizeOptions() {

        const newOptionWidth =
            document.getElementsByClassName("selectorbutton")[0].offsetWidth
        const newOptionSelectorHeight = window.innerHeight
            - document.getElementsByClassName("selectorbutton")[0].offsetHeight
            - document.getElementsByClassName("navbar")[0].offsetHeight
            - 20;

        changeOptionWidth(newOptionWidth)
        updateOptionSelectorHeight(newOptionSelectorHeight)
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
        clearInterval(intervalObj);
        updateCodeInAutoRun(false);

    }

    function handleOptionClick(event) {

        changeShowOptions(false);

        localStorage.setItem(
            `snippet${currentSelection}`,
            JSON.stringify(interpretorState));

        updateCurrentSelection(event.currentTarget.id);
    
        const newValue = JSON.parse(
            localStorage.getItem(
                `snippet${event.currentTarget.id}`)
        )

        updateInterpretorState((oldValue) => {
                return {
                    ...newValue,
                    globalStack: [],
                    currentCode: new FLCode(newValue.currentCode.internalText, 200),
                    lineMarking: {currentEvalLine: null, currentErrorLine: null},
                    nominalStackSize: 0,
                }
            });

        updateEditorContent(newValue.currentCode.internalText);
    }

    let selectorCaption = "-- Select a code snippet --"
    try {
        selectorCaption = `Snippet ${Number(currentSelection)+ 1} - ` + options[currentSelection].name
    } catch {}

    return (
        <>
            <div className = "selector">
                <div className = "selectorbutton" onClick = {handleSelectorClick} data-testid = "selecton-button">
                    <div className = "clickignore">
                        <h2 className = "clickignore">{selectorCaption}</h2>
                        <p className = "h2_sub clickignore">Select pre-written code snippets</p>
                    </div>
                    <div className = "clickignore select__dropdown-symbol__div">
                        <img className = "clickignore select__dropdown-symbol" src = {dropdownIcon} alt = "v"/>
                    </div>
                </div>
                {showOptions?
                    <div className = "selector-options" style = {{width: optionWidth, height: optionSelectorHeight}}>
                        {optionsJSX}
                    </div>: <></>
                }
            </div>
            {showOptions? <div className = "selector__popup-cover"></div> : <></>}
        </>
    )
}

export default Selector;