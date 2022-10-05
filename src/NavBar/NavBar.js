import "./NavBar.css"

import React from "react";

function NavBar({updateShowPopUp, updateWhichPopUp}) {

    function handleHelpClick(event) {
        updateWhichPopUp("help");
        updateShowPopUp(true);
    }

    function handleAboutClick(event) {
        updateWhichPopUp("about");
        updateShowPopUp(true);
    }

    function handleContactClick(event) {
        updateWhichPopUp("contact");
        updateShowPopUp(true);
    }

    return (
        <div className = "navbar">
            <div className = "titleandsubtitle">
                <h1>Functional Toy Programming language</h1>
                <p>Eimantas Survila © 2022</p>
            </div>
            <div className = "navbuttons">
                <button onClick = {handleHelpClick}>Help</button>
                <button onClick = {handleAboutClick}>About</button>
                <button onClick = {handleContactClick}>Contact</button>
            </div>
        </div>
    )
}

export default NavBar;