// import axios from '../app/node_modules/axios'
// import { parseString } from 'xml2js';
//
// const url = {
//   players: 'http://s149-fr.ogame.gameforge.com/api/players.xml',
//   positions: 'http://s149-fr.ogame.gameforge.com/api/universe.xml',
//   player: 'https://s149-fr.ogame.gameforge.com/api/playerData.xml?id=',
// }
//
// function getUserById(players, id) {
//   for (let i = 0; i < players.length; i++) {
//     if (players[i].id === id) return players[i].name;
//   }
// }
//
// axios.get(url.players)
// .then(({ data }) => {
//   return new Promise((resolve, reject) => {
//     parseString(data, (err, res) => {
//       if (err) reject(err);
//       resolve(res.players.player.map(p => p.$));
//     });
//   });
// })
// .then(players => {
//   axios.get(url.positions)
//   .then(({ data }) => {
//     parseString(data, (err, res) => {
//       if (err) return console.log(err);
//       console.log(new Date(res.universe.$.timestamp * 1000).toString());
//       const planets = res.universe.planet;
//       const moons= [];
//       planets.forEach(planet => {
//         if (planet.$.coords.indexOf('4') === 0 && planet.moon)
//           moons.push(planet.$.coords.slice(2).replace(':', '.') + ' ' + getUserById(players, planet.$.player));
//       });
//       console.log(moons.sort((a, b) => {
//         return (parseFloat(a) - parseFloat(b));
//       }));
//     });
//   })
// });

// axios.get(url.positions)
// .then(({ data }) => {
//   parseString(data, (err, res) => {
//     if (err) return console.log(err);
//     console.log(new Date(res.universe.$.timestamp * 1000).toString());
//     const planets = res.universe.planet;
//     const moons= [];
//     planets.forEach(planet => {
//       if (planet.$.coords.indexOf('4') === 0 && planet.moon) moons.push(planet.$.coords.slice(2).replace(':', '.'));
//     });
//     console.log(moons.sort((a, b) => {
//       return (a - b);
//     }));
//   });
// }).catch(err => console.log(err));

// var a = new Date('1991-23-07');
// var b = new Date('1991-07-22T22:00:00.000Z');
// console.log(a.toString());
// console.log(b.toString());

let a = () => {
   a = 1;
   console.log(a);

}
a()
a()
