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
                <p onClick = {handleHelpClick} >Help</p>
                <p onClick = {handleAboutClick} >About</p>
                <p onClick = {handleContactClick} >Contact</p>
            </div>
        </div>
    )
}

export default NavBar;