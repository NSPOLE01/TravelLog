import React, { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { listLogEntries } from "./API";
import "mapbox-gl/dist/mapbox-gl.css";
import LogEntryForm from "./LogEntryForm";

function App() {
  const [logEntries, setLogEntries] = useState([]);
  const [popup, setPopup] = useState({});
  const [addEntry, setAddEntry] = useState(null);

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  useEffect(() => {
    getEntries();
  }, []);

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat.toArray();
    setAddEntry({
      latitude,
      longitude,
    });
  };

  return (
    <Map
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      initialViewState={{
        longitude: -95.665,
        latitude: 37.6,
        zoom: 3,
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      doubleClickZoom={false}
      onDblClick={showAddMarkerPopup}
    >
      {logEntries.map((entry, index) => (
        <React.Fragment key={entry._id}>
          <Marker
            longitude={entry.longitude}
            latitude={entry.latitude}
            anchor="bottom"
            onClick={() =>
              setPopup({
                [entry._id]: true,
              })
            }
          >
            <div>
              <img
                src="https://cdn-icons-png.flaticon.com/512/3177/3177361.png"
                width="24"
                height="24"
                alt="Pin free icon"
                title="Pin free icon"
              />
            </div>
          </Marker>
          {popup[entry._id] ? (
            <Popup
              longitude={entry.longitude}
              latitude={entry.latitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setPopup({})}
            >
              <div className="popup">
                <h3>{entry.title}</h3>
                <p>{entry.comments}</p>
                <small>
                  Visited on: {new Date(entry.visitDate).toLocaleDateString()}
                </small>
                {entry.image && <img src={entry.image} alt={entry.title} />}
              </div>
            </Popup>
          ) : null}
        </React.Fragment>
      ))}
      {addEntry ? (
        <>
          <Marker longitude={addEntry.longitude} latitude={addEntry.latitude}>
            <div>
              <img
                src="https://cdn-icons-png.flaticon.com/512/3177/3177361.png"
                width="24"
                height="24"
                alt="Pin free icon"
                title="Pin free icon"
              />
            </div>
          </Marker>{" "}
          <Popup
            longitude={addEntry.longitude}
            latitude={addEntry.latitude}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setAddEntry(null)}
          >
            <div className="popup">
              <LogEntryForm
                onClose={() => {
                  setAddEntry(null);
                  getEntries();
                }}
                location={addEntry}
              />
            </div>
          </Popup>
        </>
      ) : null}
    </Map>
  );
}

export default App;
