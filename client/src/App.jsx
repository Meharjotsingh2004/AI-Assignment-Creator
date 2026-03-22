
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Assignments from "./pages/Assignments";
import CreateAssignment from "./pages/CreateAssignment";
import QuestionPaper from "./pages/QuestionPaper";
import './App.css'
import Home from "./pages/Home";

function App() {
 

  return (
    <>
     <BrowserRouter>
      <Layout>
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/assignments/create" element={<CreateAssignment />} />
          <Route path="/assignments/:id" element={<QuestionPaper />} />
          <Route path="/groups" element={<div className="text-gray-400 text-center mt-20">Coming Soon</div>} />
          <Route path="/toolkit" element={<div className="text-gray-400 text-center mt-20">Coming Soon</div>} />
          <Route path="/library" element={<div className="text-gray-400 text-center mt-20">Coming Soon</div>} />
           <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
    </>
  )
}

export default App
