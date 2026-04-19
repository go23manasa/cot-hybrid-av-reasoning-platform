import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Compare from "./pages/Compare";
import Analytics from "./pages/Analytics";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;