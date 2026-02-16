import react from "react"
import "./BuildingGrid.css"
import BuildingCard from "../BuildingCard/BuildingCard"

const BuildingGrid = ({Buildings}) => {
    return (
        <section className= "Grid">
            {Buildings.map ((building) => (
                <BuildingCard key = {building.name} building = {building}/>
            ))}
        </section>
    );
}

export default BuildingGrid;
