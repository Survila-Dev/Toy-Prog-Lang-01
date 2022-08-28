import "./Selector.css"

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

        if (showOptions && className !== "selectorbutton" && className !== "optionarticle") {
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
                {"Here some text "+i}
            </article>
        )
    }
    return (
        <>
            <div className = "selector">
                <div className = "selectorbutton" onClick = {handleSelectorClick}>
                    <p>Selector</p>
                    <p>V</p>
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