import React from "react";

function ControlPanel() {
    return (
        <div className = "controlpanel">
            
            <button>Eval</button>
            <div>
                <button>Eval to Break Point</button>
                <button>Eval Eval One Line</button>
                <button>Start at the Beginning</button>
            </div>
        </div>
    )
}

export default ControlPanel;