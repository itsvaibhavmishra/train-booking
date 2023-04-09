import React from 'react';

export default function SocialComp() {
  return (
    <button className="mt-5 mr-28">
      <a
        href="https://github.com/itsvaibhavmishra/train-booking"
        className="bg-white hover:bg-[#161B22] hover:text-white duration-200 border text-black py-2 px-4 rounded"
        target="_blank"
        rel="noreferrer"
      >
        <i className="fa-brands fa-github-alt mx-2 "></i>
        GitHub
      </a>
    </button>
  );
}
