import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Live from "./pages/Live";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Live" element={<Live />} />
      </Routes>
    </BrowserRouter>
)}

export default App;