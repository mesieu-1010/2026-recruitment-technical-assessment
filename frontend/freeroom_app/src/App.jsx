import { useMemo, useState } from "react";
import Navbar from "./Components/Navbar/Navbar";
import Controls from "./Components/Controls/Controls";



function App() {
  const [isOpen, setIsOpen] = useState(true);

  

  return (
    <div className="page">
        <Navbar
          isOpen = {isOpen}
          onToggleDoor = {() => setIsOpen ((prev) => !prev)}
        />

        <Controls/>

        
    </div>
  );
}

export default App;
