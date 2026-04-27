import { BrowserRouter, Routes, Route } from "react-router-dom";

import Upload from "./pages/Upload";
import Verify from "./pages/Verify";
import Blockchain from "./pages/Blockchain";
import Merkle from "./pages/Merkle";
import Scanner from "./pages/Scanner";

import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <div className="min-h-screen px-4 py-6">
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/blockchain" element={<Blockchain />} />
          <Route path="/merkle" element={<Merkle />} />
          <Route path="/scanner" element={<Scanner />} />
        </Routes>
      </div>

    </BrowserRouter>
  );
}

export default App;
