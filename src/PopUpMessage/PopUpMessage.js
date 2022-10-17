import "./PopUpMessage.css"
import photoAbout from "./Bewerbungsfoto.JPG";
import gifExample from "./example_gif.gif";
import iconX from "./8666595_x_icon.svg";

import React from "react"

function PopUpMessage({whichPopUp, updateShowPopUp}) {

    const [currentArticlePage, updateCurrentArticlePage] = React.useState(0);

    const aboutArticle = [
        {
        title: "Toy Programming Language by Eimantas Survila",
        image: photoAbout,
        text: [
            <p>Hello,</p>,
            <p>I am self-taught front-end developer with master of science in aerospace engineering. Currently I am doing my PhD in engineering and learning front-end development in the free time.</p>,
            <p>Tech stack:</p>,
            <div className = "about__tech_tag">
                <div>HTML5</div>
                <div>CSS3</div>
                <div>JavaScript</div>
                <div>TypeScript</div>
                <div>React</div>
                <div>Jest</div>
            </div>    
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
                <p>I am self-taught front-end developer with master of science in aerospace engineering. Currently I am doing my PhD in engineering and learning front-end development in the free time.</p>
                ],
            firstArticle: false,
            lastArticle: true
        },
        ]

    const contactArticle = [{
        title: "Get in Contact!",
        image: "",
        text: [
            <p>Please get in contact!</p>,
            <div className = "pop-up__contact_grid">
                <div className = "contact_grid_a">
                    <p>E-Mail</p>
                    <p>eimantas.survila.contact@gmail.com</p>
                </div>
                <a href = "https://www.linkedin.com/in/eimantas-survila/" className = "contact_grid_b">LinkedIn</a>
                <a href = "https://www.linkedin.com/in/eimantas-survila/" className = "contact_grid_c">GitHub</a>
            </div>,
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

    function handleBackgroundClick(event) {
        updateShowPopUp(false);
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
                <button className = "popupclosebutton" onClick = {handleExitClick}>
                    <img src={iconX} alt="x"/>
                </button>

                {(!currentArticle[currentArticlePage].firstArticle && whichPopUp !== "contact")? <button onClick = {handlePreviousClick} className = "pop-up__control_button">PREVIOUS</button>: <div></div>}
                {(!currentArticle[currentArticlePage].lastArticle && whichPopUp !== "contact")? <button onClick = {handleNextClick} className = "pop-up__control_button">NEXT</button>: <></>}   
            </div>
        </article>
        <div className = "popupcover" onClick = {handleBackgroundClick}></div>
        
        </div>
    )
}

export default PopUpMessage;