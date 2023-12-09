import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Main from "./components/main";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { AuthProtect } from "./AuthProtect";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* auth routes */}
        <Route path="/login" element={<AuthProtect element={<Login />} />} />
        <Route path="/signup" element={<AuthProtect element={<Signup />} />} />

        {/* Regular Routes */}
        <Route path="/" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
