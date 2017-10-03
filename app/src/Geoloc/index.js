import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Map from './Map/';
import axios from 'axios';

const getAdress = function(latlng) {
  const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng + '&key=AIzaSyDE0o19-BhBWjMrmbPHrHVTTttfWHFeRyI';
  return new Promise((resolve, reject) => {
    axios.get(url).then(({ data }) => {
      resolve(data.results[1].formatted_address);
    }).catch(err => reject(err));
  });
}

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }
    this.moveMarker = this.moveMarker.bind(this);
    this.initMap = this.initMap.bind(this);
    this.updatePos = this.updatePos.bind(this);
  }

  moveMarker(pos) {
    this.setState({
      marker: {
        lat: pos.latLng.lat(),
        lng: pos.latLng.lng(),
      },
    });
  }

  initMap() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        this.setState({
          open: true,
          marker: {lat, lng}
        });
      }, () => {
        const { currentLoc } = this.props;
        const lat = +currentLoc[0];
        const lng = +currentLoc[1];
        this.setState({
          open: true,
          marker: {lat, lng}
        });
      });
    } else {
      alert("Your navigator doesn't support geolocation");
    }
  }

  async updatePos() {
    const { marker: { lat, lng } } = this.state;
    const latlng = lat + ',' + lng;
    try {
      const adress = await getAdress(latlng);
      const loc = {latlng, adress}
      this.setState({open: false});
      this.props.onUpdate(loc);
    } catch(e) { alert('not a valid place') }
  }

  render() {
    const actions = [
      <FlatButton
        label="Save"
        primary={true}
        onTouchTap={this.updatePos}
        disabled={false}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => this.setState({open: false})}
        disabled={false}
      />,
    ];
    const { open, marker } = this.state;
    const { currentLoc } = this.props;
    return (
      <div>
        <TextField
          multiLine={true}
          floatingLabelText='location'
          onSelect={this.initMap}
          value={this.props.adress}
        />
        <Dialog
          actions={actions}
          open={open}
          modal={true}
          onRequestClose={() => this.setState({open: false})}
        >
          <Map
            marker={marker}
            lat={+currentLoc[0]}
            lng={+currentLoc[1]}
            moveMarker={this.moveMarker}
            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyA7WL_e2IinaX7y1oGlI75Q2ESRMWO-Nes"
            loadingElement={<div style={{ height: `500px` }} />}
            containerElement={<div style={{ height: `500px` }} />}
            mapElement={<div style={{ height: `500px` }} />}
          />
        </Dialog>
      </div>
    );
  }
}
