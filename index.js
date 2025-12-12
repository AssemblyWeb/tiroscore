const arquero = {
    // prinmera vuelta
  1: { disparo1: 'M', disparo2: 'M', estacion: 10 },   // Estación 10 original
  2: { disparo1: 'M', disparo2: 'M', estacion: 11 },   // Estación 11
  3: { disparo1: 'M', disparo2: 'M', estacion: 12 },   // Estación 12
  4: { disparo1: 5, disparo2: 'M', estacion: 1 },   // Estación 13
  5: { disparo1: 10, disparo2: 5, estacion: 2 },   // Estación 14
  6: { disparo1: 5, disparo2: 5, estacion: 3 },   // Estación 15
  7: { disparo1: 5, disparo2: 5, estacion: 4 },   // Estación 16
  8: { disparo1: 8, disparo2: 'M', estacion: 5 },   // Estación 17
  9: { disparo1: 8, disparo2: 5, estacion: 6 },   // Estación 18
  10: { disparo1: 5, disparo2: 5, estacion: 7 },  // Estación 19
  11: { disparo1: 'M', disparo2: 'M', estacion: 8 },  // Estación 20
  12: { disparo1: 8, disparo2: 8, estacion: 9 },  // Estación 21
  //segunda vuelta
  13: { disparo1: 5, disparo2: 5, estacion: 10 },  // Estación 22
  14: { disparo1: 5, disparo2: 5, estacion: 11 },  // Estación 23
  15: { disparo1: 8, disparo2: 0, estacion: 12 },    // Estación 24
  16: { disparo1: 5, disparo2: 5, estacion: 1 },  // Estación 1 original
  17: { disparo1: 8, disparo2: 8, estacion: 2 },  // Estación 2
  18: { disparo1: 5, disparo2: 'M', estacion: 3 },  // Estación 3
  19: { disparo1: 'M', disparo2: 'M', estacion: 4 },  // Estación 4
  20: { disparo1: 5, disparo2: 5, estacion: 5 },  // Estación 5
  21: { disparo1: 5, disparo2: 'M', estacion: 6 },  // Estación 6
  22: { disparo1: 8, disparo2: 5, estacion: 7 },  // Estación 7
  23: { disparo1: 'M', disparo2: 'M', estacion: 8 },  // Estación 8
  24: { disparo1: 10, disparo2: 5, estacion: 9 }    // Estación 9
};
const estaciones = {
  1: { distancia: 17, altura: 'bajo', animal: {tipo: 'zorro', superficie: "media"}},
  2: { distancia: 18, altura: 'alto', animal: {tipo: 'lobo', superficie: "grande"} },
  3: { distancia: 12.2, altura: 'alto', animal: {tipo: 'caracol', superficie: "chica"} },
  4: { distancia: 19.2, altura: 'medio', animal: {tipo: 'mandril', superficie: "media"} },
  5: { distancia: 19.7, altura: 'medio', animal: {tipo: 'mulita', superficie: "chica"} },
  6: { distancia: 26, altura: 'medio', animal: {tipo: 'oso', superficie: "grande"} },
  7: { distancia: 13.5, altura: 'bajo', animal: {tipo: 'ardilla', superficie: "chica"} },
  8: { distancia: 22.4, altura: 'bajo', animal: {tipo: 'buho', superficie: "media"} },
  9: { distancia: 16, altura: 'bajo', animal: {tipo: 'liebre', superficie: "chica"} },
  10: { distancia: 13, altura: 'bajo', animal: {tipo: 'perdiz', superficie: "chica"} },
  11: { distancia: 11.5, altura: 'bajo', animal: {tipo: 'gato', superficie: "media"} },
  12: { distancia: 19.2, altura: 'bajo', animal: {tipo: 'condor', superficie: "media"} }
};


const distances = Object.values(estaciones).map(s => s.distancia);
const distanciaMinima = Math.min(...distances);
const distanciaMaxima = Math.max(...distances);
console.log('Distancia mínima:', distanciaMinima);
console.log('Distancia máxima:', distanciaMaxima);


const step = (distanciaMaxima - distanciaMinima) / 3;
const r1 = distanciaMinima + step;
const r2 = distanciaMinima + 2 * step;

const distanciaCorta = [parseFloat(distanciaMinima.toFixed(2)), parseFloat(r1.toFixed(2))];
const distanciaMedia = [parseFloat(r1.toFixed(2)), parseFloat(r2.toFixed(2))];
const distanciaLarga = [parseFloat(r2.toFixed(2)), parseFloat(distanciaMaxima.toFixed(2))];

const estacionesCorta = [];
const estacionesMedia = [];
const estacionesLarga = [];

const estacionesDobleM = Object.entries(arquero)
  .filter(([id, s]) => s.disparo1 === 'M' && s.disparo2 === 'M')
  .map(([id]) => Number(id));

const dobleMCount = estacionesDobleM.length;

const totalAttempts = Object.values(arquero).reduce((acc, s) => {
  return acc + (s.disparo1 !== undefined ? 1 : 0) + (s.disparo2 !== undefined ? 1 : 0);
}, 0);

const totalPoints = Object.values(arquero).reduce((acc, s) => {
  const a = s.disparo1 === 'M' ? 0 : Number(s.disparo1) || 0;
  const b = s.disparo2 === 'M' ? 0 : Number(s.disparo2) || 0;
  return acc + a + b;
}, 0);

function countValue(val) {
  return Object.values(arquero).reduce((acc, s) => {
    return acc + (s.disparo1 === val ? 1 : 0) + (s.disparo2 === val ? 1 : 0);
  }, 0);
}

function makePuntaje(val, puntosPorAcierto) {
  const cantidad = countValue(val);
  const total = cantidad * puntosPorAcierto;
  const porcentaje = totalAttempts > 0 ? parseFloat(((cantidad / totalAttempts) * 100).toFixed(2)) : 0;
  const porcentajePuntos = totalPoints > 0 ? parseFloat(((total / totalPoints) * 100).toFixed(2)) : 0;
  const porcentajeDisparos = totalAttempts > 0 ? parseFloat(((cantidad / totalAttempts) * 100).toFixed(2)) : 0; 
  return { porcentaje, total, cantidad, porcentajePuntos, porcentajeDisparos };
}

const puntajeM = makePuntaje('M', 0);
const puntaje5 = makePuntaje(5, 5);
const puntaje8 = makePuntaje(8, 8);
const puntaje10 = makePuntaje(10, 10);
const puntaje11 = makePuntaje(11, 11); // si no hay 11 quedará en cero

console.log('Total intentos:', totalAttempts);
console.log('Total puntos (todos):', totalPoints);
console.log('Puntajes:', { puntajeM, puntaje5, puntaje8, puntaje10, puntaje11 });

for (const [id, s] of Object.entries(estaciones)) {
  const d = s.distancia;
  if (d >= distanciaCorta[0] && d < distanciaCorta[1]) estacionesCorta.push(Number(id));
  else if (d >= distanciaMedia[0] && d < distanciaMedia[1]) estacionesMedia.push(Number(id));
  else estacionesLarga.push(Number(id)); // incluye el límite superior
}

console.log('Rangos:', { distanciaCorta, distanciaMedia, distanciaLarga });
console.log('Estaciones por rango:', { estacionesCorta, estacionesMedia, estacionesLarga });

const tiroData = {
  arquero,
  estaciones,
  distanciaMinima,
  distanciaMaxima,
  distanciaCorta,
  distanciaMedia,
  distanciaLarga,
  estacionesCorta,
  estacionesMedia,
  estacionesLarga,
  estacionesDobleM,
  dobleMCount,
  totalAttempts,
  totalPoints,
  puntajeM,
  puntaje5,
  puntaje8,
  puntaje10,
  puntaje11
};

// export para uso en navegador como módulo
export default tiroData;


