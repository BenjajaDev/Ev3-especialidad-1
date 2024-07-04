import React from "react";
import {Toaster, toast} from "react-hot-toast";
import './index.css';
import DirectorioDeContactos from "./components/DirectorioContactos.jsx";
import "bootstrap-icons/font/bootstrap-icons.css";



const App = () => {
  return (
    <div>
      <Toaster/>
      <DirectorioDeContactos/>
    </div>

  )
}

export default App;
