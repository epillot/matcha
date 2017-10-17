import { MongoClient, ObjectId} from 'mongodb';
import config from './config/config';
import bcrypt from 'bcrypt';
import axios from 'axios';



const HASH = bcrypt.hashSync('toto0101', 10);
const url1 = 'https://opendata.paris.fr/api/records/1.0/search/?dataset=liste_des_prenoms_2004_a_2012&facet=prenoms&rows=1000&start=1000'
const url2 = 'https://opendata.paris.fr/api/records/1.0/search/?dataset=liste_des_prenoms_2004_a_2012&rows=1000&start=2000&facet=prenoms&facet=sexe&facet=annee&exclude.sexe=F'
const names = [];
const lastnames = [];
let db;
let allTags;

function rdmNbr(start, end) {
  return ( start + Math.random() * (end - start) );
}

function getRdmDate() {
  const start = Date.parse('1950');
  const end = Date.parse('12-31-1998');
  return new Date(rdmNbr(start, end));
}

function getRdmLkf(sex) {
  const forGirl = [ 1, 1, 1, 2, 1, 1, 3, 1, 1, 1, 1, 1 ];
  const forMan = [ 2, 2, 2, 1, 2, 2, 3, 2, 2, 2, 2, 2 ];
  const i = Math.round(rdmNbr(0, 11));
  return sex === 1 ? forMan[i] : forGirl[i];
}

function getRdmLogin(name) {
  return name.substring(1, ).split('').reverse().join('') + Math.round(rdmNbr(10, 99));
}

function getRdmPic(sex) {
  const forGirl = [ 'femme1.jpg', 'femme2.jpg', 'femme3.png', 'femme4.jpg', 'femme5.jpg' ];
  const forMan = [ 'homme1.png', 'homme2.jpg', 'homme3.jpg', 'homme4.jpg', 'homme5.jpg' ];

  const i = Math.round(rdmNbr(0, 4));
  return sex === 1 ? forMan[i] : forGirl[i];
}

function getRdmTags(alltags) {
  const nb = Math.round(rdmNbr(3, 6));
  const tags = [];
  const src = allTags.slice();
  for (let i = 0; i < nb; i++) {
    const j = Math.round(rdmNbr(0, src.length - 1));
    tags.push(allTags[j]);
    src.splice( src.indexOf(src[j]), 1);
  }
  return tags;
}

function activationKey() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = '';
  for (let i = 0; i < 16; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
};


function getAdress(latlng) {
  const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng + '&key=AIzaSyDE0o19-BhBWjMrmbPHrHVTTttfWHFeRyI';
  return new Promise((resolve, reject) => {
    axios.get(url).then(({ data }) => {
      resolve(data.results[1].formatted_address);
    }).catch(err => reject(err));
  });
}

async function getRdmLoc() {
  const latMAx = 49;
  const latMin = 43.61;

  const lngMax = 6;
  const lngMin = -1;
  const lat = Math.round(rdmNbr(latMin, latMAx) * 10000) / 10000;
  const lng = Math.round(rdmNbr(lngMin, lngMax) * 10000) / 10000;

  let adress;
  try {
    adress = await getAdress(lat + ',' + lng);
  } catch (e) { adress = 'Dans un lac ou une rivère' }

  return {
    loc: {
      type: 'Point',
      coordinates: [lng, lat],
    },
    adress,
  };
}



async function getDoc(count, allTags) {
  const firstname = names[count].name;
  const sex = names[count].sex;
  const lastname = lastnames[count];
  const profilePic = getRdmPic(sex);
  const loc = await getRdmLoc();
  console.log('document ' + count + ' loaded.');
  return {
    firstname,
    lastname,
    sexValue: sex,
    birthday: getRdmDate(),
    lookingFor: getRdmLkf(sex),
    login: getRdmLogin(firstname),
    password: HASH,
    email: firstname + '.' + lastname + '@toto.com',
    pictures: [profilePic],
    profilePic,
    tags: getRdmTags(allTags),
    bio: '',
    loc: loc.loc,
    adress: loc.adress,
    ts: Date.now(),
    like: {
      to: [],
      from: [],
    },
    block: [],
    report: [],
    key: activationKey(),
    active: true,
    nbVisit: Math.round(rdmNbr(10, 2000)),
  };
}

console.log('STARTING SCRIPT.....');

console.log('loading firstnames from api...');
axios.get(url1).then( ({ data }) => {

  console.log('fetching firstnames...');
  data.records.forEach(( { fields: { prenoms, sexe } } ) => {
    const entry = {};
    switch (sexe) {
      case 'M': entry.sex = 1; break;
      case 'F': entry.sex = 2; break;
      default:
    }
    entry.name = prenoms;
    names.push(entry);
  });

  console.log('loading lastnames from api...');
  return axios.get(url2);

}).then( ({ data }) => {

  console.log('fetching lastnames');
  data.records.forEach(( { fields: { prenoms } } ) => {
    lastnames.push(prenoms);
  });

  console.log('Connexion to db...');
  return MongoClient.connect(config.mongoConfig);

}).then( dbId => {

  db = dbId;

  console.log('loading tags to db');
  return db.collection('Tags').findOne({});

}).then( ({ tags }) => {

  allTags = tags;
  let count;
  const entries = [];

  console.log('fetching documents...');
  for (count = 0; count < names.length; count++) {

    entries.push(getDoc(count, allTags));
  }

  console.log('loading location data...');
  return Promise.all(entries);

}).then(insert => {

  console.log('insertions to db...');
  return db.collection('Users').insertMany(insert);

}).then(res => {

  console.log('SUCCESS');
  console.log(res.insertedCount + ' documents inserted');
  db.close(() => {
    process.exit(0);
  });

}).catch(err => {

  console.error(err);
  db.close(() => {
    process.exit(1);
  });

});
