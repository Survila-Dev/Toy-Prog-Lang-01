import React from "react";

function Selector() {
    return (
        <div className = "selector">
            <select name="CodeSelection" id="CodeSelection">
                <option value="Code01">Volvo</option>
                <option value="Code02">Saab</option>
                <option value="Code03">Mercedes</option>
                <option value="Code04">Audi</option>
            </select>
        </div>
    )
}

export default Selector;