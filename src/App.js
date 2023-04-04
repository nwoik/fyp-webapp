import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Live from "./pages/Live";
import GuitarTuner from "./pages/GuitarTuner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Live" element={<Live />} />
          <Route path="/T" element={<GuitarTuner/>} />
      </Routes>
    </BrowserRouter>
)}

export default App;