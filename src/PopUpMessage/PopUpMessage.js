import "./PopUpMessage.css"

import React from "react"

function PopUpMessage() {
    return (
        <div className = "popupenv">
        <article className = "popuparticle">
            <div>
                <h2>Title of the article</h2>
                <p>Text of the article</p>
            </div>
            <div className = "popupcontrol">
                <button className = "popupclosebutton">X</button>
                <button>Previous</button>
                <button>Next</button>
            </div>
        </article>
        <div className = "popupcover"></div>
        
        </div>
    )
}

export default PopUpMessage;