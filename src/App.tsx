import "./App.css";
import Cities from "../src/cities.json";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  interface Location {
    name: string;
    lat: number;
    lon: number;
  }

  interface Current {
    temp_c: number;
  }

  interface RealtimeWeather {
    location?: Location;
    current?: Current;
  }

  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState({});
  const { location, current } = { ...(weather as {}) } as RealtimeWeather;

  function isValidEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleChangeEmail = (event: any) => {
    if (!isValidEmail(event.target.value)) {
      setError("Email is invalid");
    } else {
      setError(null);
    }

    setEmail(event.target.value);
  };

  const handleChangeCity = (event: any) => {
    let value = event.target.value;
    if (value === "Current position") {
      navigator.geolocation.getCurrentPosition(getLocation);
    } else {
      setCity(value);
    }
  };

  function getLocation(position: any) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    setCity(latitude + " " + longitude);
  }
  console.log(city);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (error) {
      getData();
    } else {
      setError("You can't continue without email");
    }
  };

  const options = {
    method: "GET",
    url: "https://weatherapi-com.p.rapidapi.com/current.json",
    params: { q: city },
    headers: {
      "X-RapidAPI-Key": "9a4bc677e7msha334b1c20d4e06fp1e3fa3jsn477420c21c12",
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };

  const getData = async () => {
    const responseApi = await axios
      .request(options)
      .then(function (response) {
        setWeather(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  /* useEffect(() => {
    getData();
  }, []); */

  return (
    <div className="App">
      <header className="App-header">
        <form action="*">
          <label htmlFor="email">Email</label>
          <br />
          <div>
            <input
              type={"email"}
              id="email"
              placeholder="email"
              value={email}
              onChange={handleChangeEmail}
              required
            ></input>
            {error && <div style={{ color: "red" }}>{error}</div>}
          </div>
          <br />
          <select value={city} onChange={handleChangeCity}>
            {Cities.map((item) => {
              return <option id={item.city}>{item.city}</option>;
            })}
          </select>
          <br />
          <button type="submit" onClick={handleSubmit}>
            Send
          </button>
        </form>

        <div>Results</div>
        <div>{location?.name}</div>
        <div>{location?.lat}</div>
        <div>{location?.lon}</div>
        <div>{current?.temp_c}</div>
      </header>
    </div>
  );
}

export default App;
