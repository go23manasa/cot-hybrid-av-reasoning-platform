import { BrowserRouter, Routes, Route } from "react-router-dom";

function Home() {
  return <h1>Simulation Page</h1>;
}

function Compare() {
  return <h1>Compare Page</h1>;
}

function Analytics() {
  return <h1>Analytics Page</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;