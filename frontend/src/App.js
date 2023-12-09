import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Main from "./components/main";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* auth routes */}
        {/* <Route path="/login" element={<AuthProtect element={<Login />} />} />
        <Route path="/signup" element={<AuthProtect element={<SignUp />} />} /> */}

        {/* Regular Routes */}
        <Route path="/" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
