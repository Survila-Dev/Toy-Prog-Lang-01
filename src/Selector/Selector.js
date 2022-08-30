import "./Selector.css"
import dropdownIcon from "./1063883_arrow_arrow down_down_drop_stroke arrow_icon.svg"

import React from "react";

function Selector() {

    const [showOptions, changeShowOptions] = React.useState(true);
    const [optionWidth, changeOptionWidth] = React.useState("70%");

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
        console.log(articleElements)
        console.log(articleElements["0"])
    }

    function handleOptionClick(event) {
        changeShowOptions(false)
    }

    const options = []

    for (let i = 0; i < 5; i++) {
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
            {showOptions? <div className = "popupcover"></div> : <></>}
        </>
    )
}

export default Selector;