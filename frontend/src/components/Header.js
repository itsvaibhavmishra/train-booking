import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null); // Update the state to trigger re-render
  };

  if (user) {
    const firstName = user.fullName.split(" ")[0];

    return (
      // Header when logged in
      <div className="flex justify-between xl:justify-end space-x-2 mx-4 mt-1 md:-mb-2">
        <span className="text-[#000] hover:text-[#149ddd] hover:bg-transparent px-4 py-2 border hover:border-[#ee5e5f] rounded-full transition duration-300 focus:outline-none focus:ring bg-[#eca74e] focus:border-blue-300 cursor-default max-w-[8rem] truncate">
          {firstName}
        </span>
        <span
          onClick={handleLogout}
          className="text-[#000] hover:text-[#149ddd] hover:bg-transparent px-4 py-2 border hover:border-[#eca74e] rounded-full transition duration-300 focus:outline-none focus:ring bg-[#ee5e5f] focus:border-blue-300 cursor-pointer"
        >
          Log Out
        </span>
      </div>
    );
  }

  // Header Buttons when not logged in
  return (
    <div className="flex justify-between xl:justify-end space-x-2 mx-4 mt-1 -mb-2">
      <Link
        to="/login"
        className="text-[#000] hover:text-[#149ddd] hover:bg-transparent px-4 py-2 border hover:border-[#ee5e5f] rounded-full transition duration-300 focus:outline-none focus:ring bg-[#eca74e] focus:border-blue-300"
      >
        Log In
      </Link>
      <Link
        to="/signup"
        className="text-[#000] hover:text-[#149ddd] hover:bg-transparent px-4 py-2 border hover:border-[#eca74e] rounded-full transition duration-300 focus:outline-none focus:ring bg-[#ee5e5f] focus:border-blue-300"
      >
        Sign Up
      </Link>
    </div>
  );
};

export default Header;
