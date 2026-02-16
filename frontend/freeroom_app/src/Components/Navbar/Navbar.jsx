import React from "react"
import "./Navbar.css"

import {Grid2X2, MapIcon, MoonIcon, SearchIcon } from 'lucide-react';

export default function Navbar ({isOpen, onToggleDoor}) {
    return (
        <header className="nav">
            <div className = "nav__left">
                <button 
                    className="nav__logoBtn" 
                    onClick = {onToggleDoor} 
                    aria-label = "Freerooms">
                    <img 
                        className="nav__logo"
                        src={
                            isOpen
                            ? "/assets/freeRoomsLogo.png"
                            : "/assets/freeroomsDoorClosed.png"
                        }
                        alt="Freerooms logo"
                    />
                </button>
                
                <span className = "nav__title"> FreeRooms</span>
            </div>

            <div className = "nav__right">
                <button className = "nav__iconBtn" aria-label = "Search"> 
                    <SearchIcon className = "nav__icon"/>
                </button>

                <button className = "nav__iconBtn" aria-label = "Grid"> 
                    <Grid2X2 className = "nav__icon"/>
                </button>

                <button className = "nav__iconBtn" aria-label = "Dark mode"> 
                    <MapIcon className = "nav__icon"/>
                </button>

                <button className = "nav__iconBtn" aria-label = "Filters"> 
                    <MoonIcon className = "nav__icon"/>
                </button>
            </div>
        </header>
    );
}
