import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import SocialComp from "../SocialComp";
import Header from "./Header";

const Main = () => {
  const [trainData, setTrainData] = useState(null);
  const [numSeats, setNumSeats] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const toastFunctions = {
    success: toast.success,
    error: toast.error,
    info: toast.info,
  };

  useEffect(() => {
    // Fetch train data from the backend
    const fetchTrainData = async () => {
      await axios
        .get("/api/train")
        .then(function (response) {
          const data = response.data;
          setTrainData(data.train);
        })
        .catch(function (error) {
          console.log("Fetch Train Data failed: ", error.message);
          const selectedToast = toastFunctions[error.status] || toast;
          selectedToast(error.message);
        });
    };
    fetchTrainData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBookSeats = async () => {
    const userData = JSON.parse(localStorage.getItem("user")) || { id: null };

    // Send booking request to backend
    await axios
      .post(
        "/api/train",
        { numSeats },
        {
          headers: {
            "user-id": userData.id,
          },
        }
      )
      .then(async function (response) {
        const data = response.data;

        toast.success(`Booked Seat No: ${data.seats.join(", ")}`, {
          position: "top-right",
          theme: "colored",
        });

        setNumSeats("");

        // Refresh train data from backend
        const { data: newData } = await axios.get("/api/train");
        setTrainData(newData.train);
      })
      .catch(function (error) {
        console.log("Booking seates failed: ", error.message);
        const selectedToast = toastFunctions[error.status] || toast;
        selectedToast(error.message);
      });
  };

  const handleInputChange = (event) => {
    const inputValue = parseInt(event.target.value) || "";
    if (inputValue < 1 || inputValue > 7) {
      // Set error message for invalid input
      setErrorMessage("Seats should be booked in a range of 1 - 7");
      // Clear numSeats state
      setNumSeats("");
    } else {
      // Update numSeats state with valid input
      setNumSeats(inputValue); // Set numSeats to the new value entered by the user
      // Clear error message
      setErrorMessage("");
    }
  };

  if (!trainData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto mt-5 flex flex-col md:flex-row items-center">
        <div className="max-w-md mx-auto md:max-w-2xl text-center">
          <h2 className="text-2xl text-[#ee5e5f] font-bold mb-14 pb-2 border-b border-[#eca74e4f] flex flex-col md:flex-row md:items-center md:justify-center">
            <span>Train Booking System by </span>
            <span className="md:ml-2">
              <a
                href="https://vaibhaw.netlify.app"
                target="_blank"
                className="text-[#eca74e] hover:text-[#149ddd] duration-500"
                rel="noreferrer"
              >
                Vaibhaw Mishra
              </a>
            </span>
          </h2>

          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                src="https://i.imgur.com/ilDN4RY.png"
                alt="Train_image"
                className="w-48 h-48 md:h-full md:w-64 mx-auto"
              />
            </div>
            <div className="p-8 md:mt-8">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold cursor-default">
                Train Coach: A1
              </div>
              <p className="block mt-1 text-lg leading-tight font-medium text-black hover:underline cursor-default">
                Train Number: 100001
              </p>
              <p className="mt-2 text-gray-500">
                Delhi <i className="fa-solid fa-arrow-right mx-2"></i> Banglore
              </p>
            </div>
          </div>
          {errorMessage && (
            <div className="text-red-500 mt-2">{errorMessage}</div>
          )}
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-5"
            id="numSeats"
            type="number"
            placeholder="Enter number of seats you want to book"
            min="1"
            max="7"
            value={numSeats}
            onChange={handleInputChange}
          />
          <div className="flex justify-between items-center">
            <button
              className="bg-[#eca74e] hover:bg-[#ee5e5f] duration-200 text-white font-bold py-2 px-4 rounded mt-5 mr-4 mx-auto block"
              onClick={handleBookSeats}
            >
              Book Seats
            </button>
            <SocialComp />
          </div>
        </div>
        <div className=" mx-auto w-1/2 md:ml-5 mt-5 md:mt-0">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-5">
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-center items-center">
                  <i className="fa-solid fa-couch text-green-500"></i>
                  <span className="ml-2 text-sm">Available</span>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-couch text-red-500"></i>
                  <span className="ml-2 text-sm">Booked</span>
                </div>
              </div>
            </div>
          </div>
          <div className=" mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4">
              <div className="grid grid-cols-7 gap-1 justify-center text-center">
                {trainData.coach.seats.map((seat) => (
                  <div key={seat.number}>
                    {seat.isBooked ? (
                      <i className="fa-solid fa-couch text-red-500"></i>
                    ) : (
                      <i className="fa-solid fa-couch text-green-500"></i>
                    )}
                    <div className="text-sm">{seat.number}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
