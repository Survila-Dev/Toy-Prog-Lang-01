import "./NavBar.css"

import React from "react";

function NavBar() {
    return (
        <div className = "navbar">
            <div className = "titleandsubtitle">
                <h1>Toy programming language</h1>
                <p>Eimantas Survila (c) 2022</p>
            </div>
            <div className = "navbuttons">
                <p>Help</p>
                <p>About</p>
                <p>Contact</p>
            </div>
        </div>
    )
}

export default NavBar;