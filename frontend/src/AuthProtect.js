import { Navigate } from "react-router-dom";

const AuthProtect = ({ element }) => {
  const user = localStorage.getItem("user");

  if (user) {
    return <Navigate to="/" />;
  }

  return element;
};

export { AuthProtect };
