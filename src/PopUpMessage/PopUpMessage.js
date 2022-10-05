import "./PopUpMessage.css"

import React from "react"

function PopUpMessage({whichPopUp, updateShowPopUp}) {

    const [currentArticlePage, updateCurrentArticlePage] = React.useState(0);

    // whichPopUp === "help", "about", "contact"
    const [currentArticle, updateCurrentArticle] = React.useState(
        {
            title: "First title",
            imageLocator: "image location",
            text: <p>Text of the article</p>,
            firstArticle: false,
            lastArticle: false
        }
    )

    function handleExitClick(event) {
        updateShowPopUp(false);
    }

    function handlePreviousClick(event) {
        updateCurrentArticlePage((cur) => cur - 1)
    }

    function handleNextClick(event) {
        updateCurrentArticlePage((cur) => cur + 1)
    }

    return (
        <div className = "popupenv">
        <article className = "popuparticle">
            <div>
                <h2>{currentArticle.title}</h2>
                <div className = "pop-up-article__content">
                    <p>{currentArticle.imageLocator}</p>
                    {currentArticle.text}
                </div>
            </div>
            <div className = "popupcontrol">
                <button className = "popupclosebutton" onClick = {handleExitClick}>X</button>
                {!currentArticle.firstArticle? <button onClick = {handlePreviousClick}>Previous</button>: <div></div>}
                {!currentArticle.lastArticle? <button onClick = {handleNextClick}>Next</button>: <div></div>}   
            </div>
        </article>
        <div className = "popupcover"></div>
        
        </div>
    )
}

export default PopUpMessage;