import React from 'react';
import {Link} from 'react-router-dom';


const Header = () => {
    return (
        <div className="nav-wrapper" >
            <nav>
                <ul>
                    <li>
                    <Link to={"/"} className="brand-Logo">Logo</Link>
                    </li>
                    <li>
                        <Link to ={"/"}>Home</Link>
                    </li>
                    <li>
                        <Link to={"/Analytics"}>Analytics</Link>
                    </li>
                    <li>
                        <Link to={"/Datadisplay"}>DataDisplay</Link>
                    </li>
                </ul>
            </nav>    
        </div>
    )
}

export default Header;