import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import MovieDetail from "./MovieDetail";
import Companies from "./Companies";
import Users from "./Users";
import Movies from "./Movies";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:movieId" element={<MovieDetail />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/users" element={<Users />} />
        <Route path="/movies" element={<Movies />} />
      </Routes>
    </>
  );
}

export default App;