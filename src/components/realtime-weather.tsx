import { useEffect, useState } from "react";
import Cities from "../cities.json";
import validator from "validator";
import axios from "axios";
import { RealtimeWeather } from "../model/location";
import Clouds from "../img/clouds.png";
import { API_KEY, API_HOST, API_URL } from "../config/constants";
import {
  Container,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  Button,
  FormControl,
  Typography,
  Alert,
} from "@mui/material";

export default function RealtimeWeatherApp() {
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState<string>("");
  const [isValidEmail, setIsValidEmail] = useState<Boolean>();
  const [showResults, setShowResults] = useState(false);
  const [weather, setWeather] = useState({});
  const { location, current } = { ...(weather as {}) } as RealtimeWeather;

  const validateEmail = (event: any) => {
    //validator from https://www.geeksforgeeks.org/how-to-validate-an-email-in-reactjs/
    var email = event.target.value;

    if (validator.isEmail(email)) {
      setIsValidEmail(true);
      setError("");
    } else {
      setError("Enter valid Email!");
      setIsValidEmail(false);
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
    // location from https://www.w3schools.com/jsref/met_geo_getcurrentposition.asp
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    setCity(latitude + " " + longitude);
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isValidEmail && city) {
      getData();
    }
  };

  const options = {
    method: "GET",
    url: API_URL,
    params: { q: city },
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": API_HOST,
    },
  };

  const getData = async () => {
    await axios
      .request(options)
      .then(function (response) {
        setWeather(response.data);
        setShowResults(true);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        sx={{
          width: 300,
          height: "100%",
          backgroundColor: "#fcfcfc",
          padding: "20px",
          margin: "auto",
          display: "block",
          marginTop: "100px",
        }}
      >
        <Grid container rowSpacing={2}>
          <Grid item xs={12}>
            <img src={Clouds} style={{ margin: "auto", display: "block" }} />
          </Grid>
          <Typography variant="h5" sx={{ margin: "auto" }}>
            Realtime Weather
          </Typography>
          <Grid item xs={12}>
            <TextField
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={validateEmail}
              required
              variant="standard"
              fullWidth
            />
            {error && <Alert severity="error">{error} </Alert>}
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel id="city">City</InputLabel>
              <Select
                value={city}
                label="Select a city"
                onChange={handleChangeCity}
              >
                <MenuItem key={0} value={"Current position"}>
                  Current location
                </MenuItem>
                {Cities.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.city}>
                      {item.city}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              type="submit"
              disabled={!isValidEmail}
              onClick={handleSubmit}
              fullWidth
              sx={{
                backgroundColor: "#00d1f0",
                boxShadow: "none",
                textTransform: "none",
              }}
            >
              Send
            </Button>
          </Grid>
          <Grid item xs={12}>
            {showResults ? (
              <>
                <div>City: {location?.name}</div>
                <div>Temperature: {current?.temp_c}</div>
                <div>Latitude: {location?.lat}</div>
                <div>Longitude: {location?.lon}</div>
              </>
            ) : null}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
