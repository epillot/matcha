// let ft = (cb) => cb('1');
// let ft2 = (cb2) => cb2('2');


resolveAfter2Seconds = (x) => {
  return new Promise( resolve => { setTimeout( () => { resolve(x) }, 2000) } );
};

let ft = async function(x) {
  var a = resolveAfter2Seconds(' toi');
  var b = resolveAfter2Seconds(' !');
  return x + await a + await b;
};

ft('hello').then( v => { console.log(v) } );

//console.log(ft(10));
