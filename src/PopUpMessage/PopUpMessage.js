import "./PopUpMessage.css"
import photoAbout from "./Bewerbungsfoto.JPG";
import gifExample from "./example_gif.gif";

import React from "react"

function PopUpMessage({whichPopUp, updateShowPopUp}) {

    const [currentArticlePage, updateCurrentArticlePage] = React.useState(0);

    const aboutArticle = [
        {
        title: "Toy Programming Language by Eimantas Survila 1",
        image: photoAbout,
        text: [
            <p>Hello,</p>,
            <p>I am self-taught front-end developer with master of science in aerospace engineering. Currently I am doing my PhD in manufacturing technologies and learning front-end development in the free time.</p>
            ],
        firstArticle: true,
        lastArticle: true
        }]

    const listOfHelpArticles = [
        {
            title: "Help 1",
            image: gifExample,
            text: [
                <p>Hello,</p>,
                <p>I am self-taught front-end developer with master of science in aerospace engineering. Currently I am doing my PhD in manufacturing technologies and learning front-end development in the free time.</p>
                ],
            firstArticle: true,
            lastArticle: false
        },
        {
            title: "Help 2",
            image: gifExample,
            text: [
                <p>Hello,</p>,
                <p>I am self-taught front-end developer with master of science in aerospace engineering. Currently I am doing my PhD in manufacturing technologies and learning front-end development in the free time.</p>
                ],
            firstArticle: false,
            lastArticle: false
        },
        {
            title: "Help 3",
            image: gifExample,
            text: [
                <p>Hello,</p>,
                <p>I am self-taught front-end developer with master of science in aerospace engineering. Currently I am doing my PhD in manufacturing technologies and learning front-end development in the free time.</p>
                ],
            firstArticle: false,
            lastArticle: true
        },
        ]

    const contactArticle = [{
        title: "Get in Contact!",
        image: "",
        text: [
            <p>Please get in contact with any of the following social media:</p>,
            <p>E-Mail: eimantas.survila.contact@gmail.com</p>,
            <a href = "https://www.linkedin.com/in/eimantas-survila/">LinkedIn</a>
        ],
        firstArticle: true,
        lastArticle: true
    }]

    const [currentArticle, updateCurrentArticle] = React.useState((()=> {
        if (whichPopUp === "contact") {
            return contactArticle
        } else if (whichPopUp === "about") {
            return aboutArticle
        } else {
            return listOfHelpArticles
        }
    })()    
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
//
    return (
        <div className = "popupenv">
        <article className = "popuparticle">
            <div className = "pop-up-article__upper-part">
                <h2>{currentArticle[currentArticlePage].title}</h2>
                {whichPopUp !== "contact"? 
                <div className = "pop-up-article__content">
                    <img src = {currentArticle[currentArticlePage].image} alt = "profile photo" className = "pop-up-article_image"/>
                    <div className = "pop-up-article__content__text">
                        {currentArticle[currentArticlePage].text}
                    </div>
                </div>      
                :
                <div className = "pop-up-article__content_contact">
                    <div className = "pop-up-article__content__text">
                        {currentArticle[currentArticlePage].text}
                    </div>
                </div>
                }

            </div>
            <div className = "popupcontrol">
                <button className = "popupclosebutton" onClick = {handleExitClick}>X</button>
                {(!currentArticle[currentArticlePage].firstArticle && whichPopUp !== "contact")? <button onClick = {handlePreviousClick}>Previous</button>: <div></div>}
                {(!currentArticle[currentArticlePage].lastArticle && whichPopUp !== "contact")? <button onClick = {handleNextClick}>Next</button>: <></>}   
                {whichPopUp === "contact"? <button onClick = {handleSendClick}>Send</button>: <></>}
            </div>
        </article>
        <div className = "popupcover"></div>
        
        </div>
    )
}

export default PopUpMessage;