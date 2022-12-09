
import './App.css';
import {useState, useEffect} from 'react';
import {accessToken, logout, getCurrentUserProfile} from './spotify';
import {catchErrors} from "./utils";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";


function App() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  
  useEffect(()=> {
    setToken(accessToken);

    const fetchData = async () => {
        const {data} = await getCurrentUserProfile();
        setProfile(data);
    }


    catchErrors(fetchData());

  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {!token ? (
          <a
          className="App-link"
          href="http://localhost:8888/login"
          >
          Log in to spotify
        </a>
        ) : (
          <Router>
            <Routes>
              <Route path="/top-artists">
                <h1>Top Artists</h1>
              </Route>
              <Route path="/top-tracks">
                <h1>Top Tracks</h1>
              </Route>
              <Route path="/playlists/:id">
                <h1>Playlist</h1>
              </Route>
              <Route path="/playlists">
                <h1>Playlists</h1>
              </Route>
              <Route path="/">
                <>
                <button onClick={logout}>LogOut</button>
                
                {profile && (
                  <div>
                  <h1>{profile.ddisplay_name}</h1>
                  <p>{profile.followers.total} Followers</p>
                  {profile.images.lenth && profile.images[0].url && (
                    <img src={profile.images[0].url} alt="Avatar"/> 
                )};
                </div>
                )}
                </>
              </Route>
            </Routes>
          </Router>
          
        )}
      </header>
    </div>
  );
}

export default App;
