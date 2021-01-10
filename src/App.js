import spotifyLogo from "./spotify.svg";
import "./App.css";
import { Component } from "react";

const authEndpoint = "https://accounts.spotify.com/authorize?";
const userEndpoint = "https://api.spotify.com/v1/me/top";
const recentlyPlayedEndpoint =
  "https://api.spotify.com/v1/me/player/recently-played";

const clientId = "";
const redirectUri = "";
const scopes = [
  "user-read-recently-played",
  "user-read-playback-state",
  "user-top-read",
];

// Get the hash of the url
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function (initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
window.location.hash = "";

class App extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
    };
  }

  componentDidMount() {
    // Set token
    let _token = hash.access_token;
    if (_token) {
      // Set token
      this.setState({
        token: _token,
      });
      this.getTopArtists(_token);
      this.getTopTracks(_token);
      this.getRecentlyPlayed(_token);
    }
  }

  async getTopArtists(token) {
    try {
      await fetch(`${userEndpoint}/artists?limit=5`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        response.json().then((topArtists) => {
          let userTopArtists = [];
          for (const [key, value] of Object.entries(topArtists)) {
            if (key === "items") {
              value.map((artist) => {
                userTopArtists.push(artist.name);
              });
              this.setState({
                userTopArtists: userTopArtists.map((artist) => (
                  <li key={artist}>{artist}</li>
                )),
                no_data: false,
              });
            }
          }
        });
      });
    } catch (err) {
      console.log("Error in getTopArtists - " + err);
    }
  }

  async getTopTracks(token) {
    try {
      await fetch(`${userEndpoint}/tracks?limit=5`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        response.json().then((topTracks) => {
          let userTopTracks = [];
          for (const [key, value] of Object.entries(topTracks)) {
            if (key === "items") {
              value.map((track) => {
                userTopTracks.push(track.name);
              });
              this.setState({
                userTopTracks: userTopTracks.map((track) => (
                  <li key={track}>{track}</li>
                )),
                no_data: false,
              });
            }
          }
        });
      });
    } catch (err) {
      console.log("Error in getTopTracks - " + err);
    }
  }

  async getRecentlyPlayed(token) {
    try {
      await fetch(`${recentlyPlayedEndpoint}/?limit=5`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        response.json().then((recentlyPlayed) => {
          let userRecentlyPlayed = [];
          for (const [key, value] of Object.entries(recentlyPlayed)) {
            if (key === "items") {
              value.map((track) => {
                userRecentlyPlayed.push(
                  track.track.name + " - " + track.track.artists[0].name
                );
              });
              this.setState({
                userRecentlyPlayed: userRecentlyPlayed.map((track) => (
                  <li key={track}>{track}</li>
                )),
                no_data: false,
              });
            }
          }
        });
      });
    } catch (err) {
      console.log("Error in getRecentlyPlayed - " + err);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={spotifyLogo} className="App-logo" alt="logo" />
          {!this.state.token && (
            <a
              className="btn"
              href={`${authEndpoint}client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              Login
            </a>
          )}
          </header>
          {this.state.token && !this.state.no_data && (
            <div className="grid-container">
              <div className="grid-item">
              Most recently played
              <ul>{this.state.userRecentlyPlayed}</ul> </div>
              <div className="grid-item">Your top 5 artists 
              <ul>{this.state.userTopArtists}</ul> </div>
              <div className="grid-item">Your top 5 tracks
              <ul >{this.state.userTopTracks}</ul> </div>
            </div>
          )}
      </div>
    );
  }
}

export default App;
