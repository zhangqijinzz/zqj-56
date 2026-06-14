import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Icebreaker from "@/pages/Icebreaker";
import RouteDraw from "@/pages/RouteDraw";
import TravelTasks from "@/pages/TravelTasks";
import Journal from "@/pages/Journal";
import JournalEditor from "@/pages/JournalEditor";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen pb-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/icebreaker" element={<Icebreaker />} />
          <Route path="/route" element={<RouteDraw />} />
          <Route path="/tasks" element={<TravelTasks />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/new" element={<JournalEditor />} />
          <Route path="/journal/:id" element={<JournalEditor />} />
        </Routes>
      </div>
    </Router>
  );
}
