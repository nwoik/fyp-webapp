import React from "react";
import {Link} from "react-router-dom";

function Home() {

    return (
        <div>
            <div className="LivePage">
                <Link to="/Live">LIVE</Link>
            </div>
            <div className="VideoPage">
                <Link to="/Live">VIDEO</Link>
            </div>
        </div>
    )
}

export default Home;