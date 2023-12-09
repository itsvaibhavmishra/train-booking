import { useState } from "react";
import { UserPlus, Eye, EyeSlash } from "phosphor-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-toastify";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toastFunctions = {
    success: toast.success,
    error: toast.error,
    info: toast.info,
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    await axios
      .post("/api/auth/signup", formData)
      .then(function (response) {
        const data = response.data;

        const selectedToast = toastFunctions[data.status] || toast;
        selectedToast(data.message);

        // Reset form fields
        setFormData({
          fullName: "",
          email: "",
          password: "",
        });
        setPasswordVisible(false);

        navigate("/login");
      })
      .catch(function (error) {
        console.error("Signup failed:", error.message);
        const selectedToast = toastFunctions[error.status] || toast;
        selectedToast(error.message);
      });
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <img
              className="h-32"
              src="https://i.imgur.com/ilDN4RY.png"
              alt="Workflow"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to an exisiting account
            </Link>
          </p>
        </div>
        <form
          className="mt-8 space-y-6"
          action="#"
          method="POST"
          onSubmit={handleLogin}
        >
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                pattern=".{3,26}"
                title="Full name must be between 3 and 26 characters"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
                required
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative rounded-none rounded-b-md">
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$"
                  title="Password must be between 8-10 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character."
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                  {passwordVisible ? (
                    <Eye
                      className="h-5 w-5 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    />
                  ) : (
                    <EyeSlash
                      className="h-5 w-5 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link
                to="/"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Go back to home?
              </Link>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus
                  weight="fill"
                  className="h-5 w-5 text-indigo-400 group-hover:text-indigo-400"
                  aria-hidden="true"
                />
              </span>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
