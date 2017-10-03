import React from 'react';
import { GoogleMap, Marker, withGoogleMap, withScriptjs } from "react-google-maps";

export default withScriptjs(withGoogleMap(function(props) {
  return (
    <GoogleMap
      onClick={props.moveMarker}
      defaultZoom={12}
      defaultCenter={{lat: props.lat, lng: props.lng}}
    >
      <Marker position={{lat: props.marker.lat, lng: props.marker.lng}}/>
      <Marker position={{lat: props.lat, lng: props.lng}}/>
    </GoogleMap>
  );
}))
