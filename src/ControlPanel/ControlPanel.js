import "./ControlPanel.css"

import React from "react";

function ControlPanel() {
    return (
        <div className = "controlpanel">
            <div>
                <button>RUN</button>
                <button>RUN to Break Point</button>
                <button>RUN One Line</button>
                <button>Start at the Beginning</button>
            </div>
            <div>
                <button>Clear</button>
            </div>
        </div>
    )
}

export default ControlPanel;