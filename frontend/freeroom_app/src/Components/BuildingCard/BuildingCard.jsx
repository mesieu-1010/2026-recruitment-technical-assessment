import react from "react"
import "./BuildingCard.css"

const BuildingCard = ({building}) => {
    const {name, rooms_available, building_picture} = building;

    return(
        <div className="card">
            <img 
                className = "card__img" 
                src = {building_picture} 
                alt = {name}/>

            <div className="card__pill">
                <span className = "card__dot"/>
                <span> {rooms_available} rooms available </span>
            </div>

            <div className = "card__name"> {name} </div>
        </div>
    )
}

export default BuildingCard