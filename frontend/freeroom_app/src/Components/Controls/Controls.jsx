import React from "react";
import "./Controls.css";
import { Filter, Search, SortDesc} from "lucide-react";

const Controls = () => {
  return (
    <section className="controls">

        <div className = "controls__left">
            <button className = "controls__btn" type = "button">
                <Filter className = "FilterIcon"/>
                <span> Filter </span>
            </button>
        </div> 

        <div className="controls__center">
            <div className="controls__searchWrap">
            <Search className="controls__searchIcon" />
            <input
                className="controls__searchInput"
                placeholder="Search for a building..."
            />
            </div>
        </div>

        <div className = "controls__right">
            <button className = "controls__btn" type = "button">
                <SortDesc className = "SortIcon"/>
                <span> Sort </span>
            </button>
        </div>

    </section>
  );
};

export default Controls;