import "./PopUpMessage.css"
import photo from "./Bewerbungsfoto.JPG";

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
    function handleSendClick(event){
        return;
    }

    return (
        <div className = "popupenv">
        <article className = "popuparticle">
            <div>
                <h2>{currentArticle.title}</h2>
                {whichPopUp !== "contact"? 
                <div className = "pop-up-article__content">
                    <img src = {photo} alt = "profile photo" className = "pop-up-article_image"/>
                    {currentArticle.text}
                </div>  
                :
                <div className = "pop-up-article__content_contact">
                    <p>Contact form here</p>
                </div>
                }

            </div>
            <div className = "popupcontrol">
                <button className = "popupclosebutton" onClick = {handleExitClick}>X</button>
                {(!currentArticle.firstArticle && whichPopUp !== "contact")? <button onClick = {handlePreviousClick}>Previous</button>: <div></div>}
                {(!currentArticle.lastArticle && whichPopUp !== "contact")? <button onClick = {handleNextClick}>Next</button>: <></>}   
                {whichPopUp === "contact"? <button onClick = {handleSendClick}>Send</button>: <></>}
            </div>
        </article>
        <div className = "popupcover"></div>
        
        </div>
    )
}

export default PopUpMessage;