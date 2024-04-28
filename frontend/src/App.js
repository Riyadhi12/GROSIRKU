import {BrowserRouter, Routes, Route} from "react-router-dom";
import Dasboard from "./pages/Dasboard";
function App() {
  return (
    <div >
     <BrowserRouter>
     <Routes>
      <Route path="/dasboard" element={<Dasboard/>}/>
     </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
