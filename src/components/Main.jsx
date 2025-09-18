/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import Primarydata from "./Primarydata";
import Secondarydata from "./Secondarydata";
import Uvindex from "./Uvindex";
import Sample from "./Sample";
import WindStatus from "./WindStatus";
import SunTime from "./SunTime";
import Humidity from "./Humidity";
import Visibility from "./Visibility";
import AirQuality from "./AirQuality";

const Main = () => {
  // Replace with your OpenWeatherMap API key
  const api_key = "YOUR_OPENWEATHERMAP_API_KEY";

  const [wdata, setWdata] = useState({
    weather: {
      description: "",
      icon: "",
    },
    temp: 0,
    rh: 0,
    wind_spd: 0,
    sunrise: "",
    sunset: "",
    vis: 0,
    aqi: 0,
    lat: 0,
    lon: 0,
    uv: 0,
  });
  const [search, setSearch] = useState("Mumbai");
  const [clickName, setClickName] = useState("cel");
  const [celbtnactive, setCelBtnActive] = useState(true);
  const [fahbtnactive, setFahBtnActive] = useState(false);

  const fetchAPI = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${api_key}&units=metric`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const result = await response.json();
      // Map OpenWeatherMap data to the structure expected by child components
      setWdata({
        weather: {
          description: result.weather && result.weather[0] ? result.weather[0].description : "",
          icon: result.weather && result.weather[0] ? result.weather[0].icon : "",
        },
        temp: result.main ? result.main.temp : 0,
        rh: result.main ? result.main.humidity : 0,
        wind_spd: result.wind ? result.wind.speed : 0,
        sunrise: result.sys ? new Date(result.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
        sunset: result.sys ? new Date(result.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
        vis: result.visibility ? (result.visibility / 1000) : 0,
        aqi: result.main && result.main.aqi ? result.main.aqi : 0, // OpenWeatherMap's free API does not provide AQI directly
        lat: result.coord ? result.coord.lat : 0,
        lon: result.coord ? result.coord.lon : 0,
        uv: 0, // OpenWeatherMap's free API does not provide UV index directly
      });
    } catch (error) {
      console.error("Weather API error:", error);
      setWdata({ weather: { description: "API Error" } });
    }
  };

  useEffect(() => {
    fetchAPI();
  }, [search]);

  const getDataFromSearchBar = (Childdata) => {
    setSearch(Childdata);
  };

  const celclick = () => {
    setClickName("cel");
    setCelBtnActive(true);
    setFahBtnActive(false);
  };
  const fahclick = () => {
    setClickName("fah");
    setFahBtnActive(true);
    setCelBtnActive(false);
  };

  return (
    <div className="Main w-screen h-screen bg-[#C1C2C6] lg:p-4 p-4 xs:p-0 sm:p-0 flex justify-center items-center">
      <div className="container w-[80%] lg:w-[80%] xs:w-full sm:w-full h-[90%] lg:h-[90%] xs:h-full sm:h-full bg-[#F6F6F8] rounded-[24px] lg:rounded-[24px] xs:rounded-none sm:rounded-none xs:flex-col sm:flex-col flex flex-row lg:flex-row md:overflow-y-scroll overflow-y-scroll lg:overflow-hidden xs:overflow-y-scroll sm:overflow-y-scroll pb-0 lg:pb-0 sm:pb-4">
        <div className="left-col w-[30%] lg:w-[30%] xs:w-full sm:w-full h-full bg-[#FFFFFF] pl-10 py-4 flex flex-col justify-between items-start gap-4">
          <SearchBar getSearchData={getDataFromSearchBar} />
          <Primarydata mainData={wdata} clickName={clickName} />
          <Secondarydata mainData={wdata} />
        </div>
        <div className="right-col w-[70%] lg:w-[70%] xs:w-full sm:w-full h-full bg-transparent flex flex-col justify-between items-stretch gap-5 p-4 lg:p-4 sm:p-2">
          <div className="top-row w-full h-[60px] flex justify-between items-center px-4 pt-2 xs:mb-4 sm:mb-4">
            <h2 className="font-Popin text-2xl xs:text-xl sm:text-2xl font-[500]">
              Today&apos;s Highlights
            </h2>
            <div className="flex gap-2 items-center">
              <button
                onClick={celclick}
                className={`w-[40px] h-[40px] flex justify-center items-center font-Popin text-[18px] font-[500] shadow-[0_0_8px_#64646f10] ${
                  celbtnactive ? "bg-black text-white" : "bg-white text-black"
                } rounded-[50%]`}
              >
                °C
              </button>
              <button
                onClick={fahclick}
                className={`w-[40px] h-[40px] flex justify-center items-center font-Popin text-[18px] font-[500] shadow-[0_0_8px_#64646f10] ${
                  fahbtnactive ? "bg-black text-white" : "bg-white text-black"
                } rounded-[50%]`}
              >
                °F
              </button>
            </div>
          </div>
          <div className="bottom-row w-full flex-1 p-2  grid grid-cols-3 lg:grid-cols-3 xs:grid-cols-1 sm:grid-cols-2 xs:gap-6 sm:gap-8  place-items-center md:place-content-stretch">
            <Uvindex mainData={wdata} />
            <WindStatus mainData={wdata} />
            <SunTime mainData={wdata} />
            <Humidity mainData={wdata} />
            <Visibility mainData={wdata} />
            <AirQuality mainData={wdata} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
