import "./PopUpMessage.css"
import photoAbout from "./Bewerbungsfotos.jpg";
import iconX from "./8666595_x_icon.svg";
import helpGif1 from "./01_Tutorial_Introduction.gif";
import helpGif2 from "./02_Tutorial_Editor.gif";
import helpGif3 from "./03_Tutorial_Buttons.gif";
import helpGif4 from "./04_Tutorial_Output.gif";
import helpGif5 from "./05_Tutorial_Selection.gif";
import helpGif6 from "./06_Tutorial_Execution_Context.gif";
import helpGif7 from "./07_Tutorial_Call_Stack.gif";

import React from "react"

function PopUpMessage({whichPopUp, updateShowPopUp}) {

    const [currentArticlePage, updateCurrentArticlePage] = React.useState(0);

    const aboutArticle = [
        {
        title: "Toy Programming Language by Eimantas Survila",
        image: photoAbout,
        text: [
            <p key = "1">Hello,</p>,
            <p key = "2">I am self-taught front-end developer with master of science in aerospace engineering. Currently I am doing my PhD in engineering and learning front-end development in the free time.</p>,
            <p key = "3">Tech stack:</p>,
            <div className = "about__tech_tag">
                <div key = "1">HTML5</div>
                <div key = "2">CSS3</div>
                <div key = "3">JavaScript</div>
                <div key = "4">TypeScript</div>
                <div key = "5">React</div>
            </div>,
            <p key = "4">Please get in contact!</p>,
            <div className = "pop-up__contact_grid"  key = "5">
                <div className = "contact_grid_a">
                    <p>E-Mail</p>
                    <p>eimantas.survila.contact@gmail.com</p>
                </div>
                <a href = "https://www.linkedin.com/in/eimantas-survila/" className = "contact_grid_b">LinkedIn</a>
                <a href = "https://github.com/Survila-Dev" className = "contact_grid_c">GitHub</a>
            </div>,   
        ],
        firstArticle: true,
        lastArticle: true
        }]

    const listOfHelpArticles = [
        {
            title: "Welcome to Toy Programming Language & Interpreter by Eimantas Survila",
            image: helpGif1,
            text: [
                <p key = "1">Edit, evaluate and interact with the code in the toy programming language.</p>,
                <p key = "2">Alter the execution context during the execution, add additional code lines to the call stack by draging it from the editor.</p>
                ],
            firstArticle: true,
            lastArticle: false
        },
        {
            title: "Tutorial 1 - Edit your code in the editor, check syntax guide for syntax",
            image: helpGif2,
            text: [
                <p key = "1">Use the editor to code.</p>,
                <p key = "2">Open the syntex guide on the top right side of the editor for help on language syntax.</p>
                ],
            firstArticle: false,
            lastArticle: false
        },
        {
            title: "Tutorial 2 - Evaluate the code by running it automatically or manuelly step by step",
            image: helpGif3,
            text: [ 
                <p key = "1">Evaluate the code automatically by clicking "RUN". The evaluation can be stopped by clicking the button "STOP"</p>,
                <p key = "2">The code can be evaluated step by step by clicking "Run One Step"</p>,
                <p key = "3">Multiple steps are required for one line: select line, push on call stack, pop from stack.</p>,
                <p key = "4">Click "Start at the Beginning" to intialize the starting position of the evaluation and to clean the call stack.</p>,    
            ],
            firstArticle: false,
            lastArticle: false
        },
        {
            title: "Tutorial 3 - Print to the console during code evaluation and check errors in the console",
            image: helpGif4,
            text: [ 
                <p key = "1">Use command "PRINT( )" to output to the console.</p>,
                <p key = "2">Any errors with the code is displayed in the console too.</p>
                ],
            firstArticle: false,
            lastArticle: false
        },
        {
            title: "Tutorial 4 - Select pre-written code snippets which demonstrate the toy programming language",
            image: helpGif5,
            text: [
                <p key = "1">Multiple pre-written code snippets are available to select from.</p>,
                <p key = "2">The changes made to a snippet including the execution environment will be saved when changing to other snippet</p>
                ],
            firstArticle: false,
            lastArticle: false
        },
        {
            title: "Tutorial 5 - Add, change, delete variables during the code evaluation",
            image: helpGif6,
            text: [
                <p key = "1">During the evalution of the code the variables are displayed with their types and values.</p>,
                <p key = "2">These values can be changed any time during the evaluation.</p>,
                <p key = "3">Additionally the variables can be added or deleted.</p>
                ],
            firstArticle: false,
            lastArticle: false
        },
        {
            title: "Tutorial 6 - Analyse and alter the call stack by draging liner number from editor",
            image: helpGif7,
            text: [
                <p key = "1">The call stack is displayed during the code evaluation.</p>,
                <p key = "2">Additionaly elements can be added to the call stack by draging them from the editor {"("}grab the editor line number of the corresponding command{")"}.</p>,
                ],
            firstArticle: false,
            lastArticle: true
        },
        ]

    const contactArticle = [{
        title: "Get in Contact!",
        image: "",
        text: [
            <p key = "1">Please get in contact!</p>,
            <div className = "pop-up__contact_grid" key = "2">
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
        <article className = "popuparticle" data-testid = "pop-up-article"  key = "1">
            <div className = "pop-up-article__upper-part"  key = "1">
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
            <div className = "popupcontrol"  key = "2">
                <button className = "popupclosebutton" onClick = {handleExitClick} data-testid = "pop-up-close">
                    <img src={iconX} alt="x"/>
                </button>

                {(!currentArticle[currentArticlePage].firstArticle && whichPopUp !== "contact")? <button onClick = {handlePreviousClick} className = "pop-up__control_button">PREVIOUS</button>: <div></div>}
                {(!currentArticle[currentArticlePage].lastArticle && whichPopUp !== "contact")? <button onClick = {handleNextClick} className = "pop-up__control_button">NEXT</button>: <></>}   
            </div>
        </article>
        <div className = "popupcover" onClick = {handleBackgroundClick}  key = "2"></div>
        
        </div>
    )
}

export default PopUpMessage;