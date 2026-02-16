import { useMemo, useState } from "react";
import Navbar from "./Components/Navbar/Navbar";
import Controls from "./Components/Controls/Controls";
import BuildingGrid from "./Components/BuildingGrid/BuildingGrid";
import data from "../../data.json"


function App() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="page">
        <Navbar
          isOpen = {isOpen}
          onToggleDoor = {() => setIsOpen ((prev) => !prev)}
        />

        <Controls/>
        <BuildingGrid Buildings={data}/>
    </div>
  );
}

export default App;
