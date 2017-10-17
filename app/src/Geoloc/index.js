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
    this.mounted = true;
    this.moveMarker = this.moveMarker.bind(this);
    this.initMap = this.initMap.bind(this);
    this.updatePos = this.updatePos.bind(this);
    this.setStateIfMounted = this.setStateIfMounted.bind(this)
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setStateIfMounted(state, cb) {
    if (this.mounted) this.setState(state, cb);
  }

  moveMarker(pos) {
    console.log('lat: ' + pos.latLng.lat());
    console.log('lng :' + pos.latLng.lng());
    this.setStateIfMounted({
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
        this.setStateIfMounted({
          open: true,
          marker: {lat, lng}
        });
      }, () => {
        const { lat, lng } = this.props;
        this.setStateIfMounted({
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
      const coordinates = [lng, lat];
      this.setStateIfMounted({open: false});
      this.props.onUpdate(coordinates, adress);
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
        onTouchTap={() => this.setStateIfMounted({open: false})}
        disabled={false}
      />,
    ];
    const { open, marker } = this.state;
    const { lat, lng, adress } = this.props;
    return (
      <div>
        <TextField
          multiLine={true}
          floatingLabelText='location'
          onSelect={this.initMap}
          value={adress}
        />
        <Dialog
          actions={actions}
          open={open}
          modal={true}
          onRequestClose={() => this.setStateIfMounted({open: false})}
        >
          <Map
            marker={marker}
            lat={lat}
            lng={lng}
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
