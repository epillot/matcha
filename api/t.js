import axios from '../app/node_modules/axios'

const key = 'AIzaSyDE0o19-BhBWjMrmbPHrHVTTttfWHFeRyI';
const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=48.8833,2.2667&key=' + key;

axios.get(url)
.then(({ data }) => {
  data.results.forEach(result => {
    console.log(result);
  })
})
.catch(err => console.log(err))
