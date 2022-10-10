import "./PopUpMessage.css"
import photoAbout from "./Bewerbungsfoto.JPG";

import React from "react"

function PopUpMessage({whichPopUp, updateShowPopUp}) {

    const [currentArticlePage, updateCurrentArticlePage] = React.useState(0);
    const aboutArticle = {
        title: "Toy Programming Language by Eimantas Survila",
        image: photoAbout,
        text: [
            <p>Hello,</p>,
            <p>I am self-taught front-end developer with master of science in aerospace engineering. Currently I am doing my PhD in manufacturing technologies and learning front-end development in the free time.</p>
            ],
        firstArticle: true,
        lastArticle: true
    }
    const contactArticle = {
        title: "Get in Contact!",
        image: "",
        text: [
            <p>E-Mail: eimantas.survila.contact@gmail.com</p>,
            <p>E-Mail: eimantas.survila.contact@gmail.com</p>
        ],
        firstArticle: true,
        lastArticle: true
    }

    // whichPopUp === "help", "about", "contact"
    const [currentArticle, updateCurrentArticle] = React.useState(
        aboutArticle
    )

    if (whichPopUp === "contact") {
        updateCurrentArticle(contactArticle)
    }

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
//
    return (
        <div className = "popupenv">
        <article className = "popuparticle">
            <div className = "pop-up-article__upper-part">
                <h2>{currentArticle.title}</h2>
                {whichPopUp !== "contact"? 
                <div className = "pop-up-article__content">
                    <img src = {currentArticle.image} alt = "profile photo" className = "pop-up-article_image"/>
                    <div className = "pop-up-article__content__text">
                        {currentArticle.text}
                    </div>
                </div>  
                :
                <div className = "pop-up-article__content_contact">
                    <div className = "pop-up-article__content__text">
                        <p>Hello</p>
                        {currentArticle.text}
                    </div>
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