import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Menu from "./components/Menu";
import Register from "./components/Register";
import DSecuencia from "./components/DSecuencia";
import DClases from "./components/DClases";
import DCU from "./DCU";
import DComponetes from "./components/DComponentes";
import DPaquetes from "./DPaquetes";
import RecoverPassword from "./components/RecoverPassword";
import Good from "./components/Good";
import Bad from "./components/Bad";
import ProjectDiagrams from "./components/ProjectDiagrams";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/register" element={<Register />} />
        <Route path="/DSecuencia" element={<DSecuencia />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/DClases" element={<DClases />} />
        <Route path="/DCU" element={<DCU />} />
        <Route path="/DComponentes" element={<DComponetes />} />
        <Route path="/DPaquetes" element={<DPaquetes />} />
        <Route path="/recover-password" element={<RecoverPassword />} />
        <Route path="/good" element={<Good />} />
        <Route path="/bad" element={<Bad />} />
        <Route path="/project/:projectId" element={<ProjectDiagrams />} />
        <Route path="/project/:projectId/sequence" element={<DSecuencia />} />
        <Route path="/project/:projectId/class" element={<DClases />} />
        <Route path="/project/:projectId/usecase" element={<DCU />} />
        <Route path="/project/:projectId/component" element={<DComponetes />} />
        <Route path="/project/:projectId/package" element={<DPaquetes />} />
      </Routes>
    </Router>
  );
}

export default App;
