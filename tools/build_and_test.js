// Construye PG_RD_brutalista.html y verifica el motor JS contra los resultados de Python.
// Uso: node tools/build_and_test.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const T = path.join(__dirname);
const data = fs.readFileSync(path.join(T, 'annual_series.json'), 'utf8');
const verif = fs.readFileSync(path.join(T, 'verificacion_python.json'), 'utf8');
let html = fs.readFileSync(path.join(T, 'template.html'), 'utf8');
html = html.replace('/*__DATA__*/', data).replace('/*__VERIF__*/', JSON.stringify(JSON.parse(verif)));
const out1 = path.join(T, '..', 'PG_RD.html');
const out2 = path.join(T, '..', 'PG_RD_brutalista.html');
const outIndex = path.join(T, '..', 'index.html');
fs.writeFileSync(out1, html);
fs.writeFileSync(out2, html);
fs.writeFileSync(outIndex, html);
console.log('OK ->', out1, ',', out2, 'e', outIndex, (html.length / 1024).toFixed(1), 'KB');

// Test: ejecutar los scripts <data> y <engine> en un sandbox
const grab = id => html.match(new RegExp(`<script id="${id}">([\\s\\S]*?)</script>`))[1];
const ctx = {}; vm.createContext(ctx);
vm.runInContext(grab('data') + grab('engine') + ';this.computePG=computePG;this.VERIF_PY=VERIF_PY;', ctx);
let fails = 0;
for (const p of ctx.VERIF_PY) {
  const j = ctx.computePG(p.lat, p.lon, { R: p.R, R_ah: p.R_ah, order: 't7f' });
  const keys = ['Tmax', 'Tmin', 'smax', 'smin', 'T_pav_alto', 'T_pav_bajo', 'DD', 'PG_H_rel'];
  const map = { Tmax: 'T_air_max', Tmin: 'T_air_min', smax: 'sigma_air_max', smin: 'sigma_air_min' };
  const maxErr = Math.max(...keys.map(k => Math.abs(j[map[k] || k] - p[k])));
  const ok = j.st.id === p.station && j.PG_alto === p.PG_alto && j.PG_bajo === p.PG_bajo && j.PG_ah === p.PG_ah && maxErr < 1e-6;
  if (!ok) fails++;
  console.log(`${ok ? 'PASS' : 'FAIL'} (${p.lat},${p.lon}) R=${p.R}/${p.R_ah} st=${j.st.id} Talto=${j.T_pav_alto.toFixed(4)} Tbajo=${j.T_pav_bajo.toFixed(4)} PGHrel=${j.PG_H_rel.toFixed(4)} PG ${j.PG_alto}${j.PG_bajo}/${j.PG_ah} maxErr=${maxErr.toExponential(2)}`);
}

// Test UI: ejecutar script <ui> en un sandbox simulado para asegurar que no hay ReferenceError
try {
  const makeElem = id => ({
    id,
    textContent: '',
    innerHTML: '',
    value: '18.5',
    style: {},
    dataset: { tab: 'tab-map', mode: 'talto', lat: '18.5', lon: '-70.0', r: '0.98' },
    classList: { add: () => {}, remove: () => {} },
    setAttribute: () => {},
    addEventListener: () => {},
    click: () => {}
  });
  const elems = {};
  const mockDoc = {
    documentElement: makeElem('html'),
    getElementById: id => (elems[id] = elems[id] || makeElem(id)),
    querySelectorAll: () => [makeElem('btn')],
    addEventListener: () => {}
  };
  const mockL = {
    divIcon: () => ({}),
    marker: () => ({
      bindTooltip: function() { return this; },
      bindPopup: function() { return this; },
      addTo: function() { return this; },
      setLatLng: function() { return this; },
      setIcon: function() { return this; },
      on: function() { return this; }
    }),
    polyline: () => ({
      addTo: function() { return this; },
      setLatLngs: function() { return this; },
      setStyle: function() { return this; }
    }),
    rectangle: () => ({
      addTo: function() { return this; }
    }),
    layerGroup: () => ({
      addTo: function() { return this; },
      addLayer: function() { return this; },
      clearLayers: function() { return this; }
    }),
    tileLayer: () => ({}),
    map: () => ({
      setView: function() { return this; },
      invalidateSize: function() { return this; },
      on: function() { return this; },
      getZoom: () => 8,
      addLayer: function() { return this; },
      removeLayer: function() { return this; },
      hasLayer: () => false
    }),
    control: {
      layers: () => ({ addTo: () => {} })
    },
    heatLayer: () => ({
      addTo: function() { return this; },
      setLatLngs: function() { return this; },
      setOptions: function() { return this; }
    })
  };
  const mockChart = function() {
    return { data: { datasets: [], labels: [] }, update: () => {} };
  };
  mockChart.defaults = { font: {} };
  const uiCtx = {
    window: { addEventListener: () => {}, setTimeout: fn => fn() },
    document: mockDoc,
    L: mockL,
    Chart: mockChart,
    Math,
    JSON,
    parseFloat,
    parseInt,
    isFinite,
    console,
    setTimeout: fn => fn()
  };
  vm.createContext(uiCtx);
  vm.runInContext(grab('data') + grab('engine') + grab('ui'), uiCtx);
  
  // Exercise interactions
  vm.runInContext(`
    setCoord(19.2, -70.5);
    setR(0.95);
    setTheme('light');
    setTheme('dark');
    
    // Test K-NN
    const knn = findKNN(18.5, -70.0, 4);
    if (!knn || knn.length !== 4) throw new Error('findKNN no retorno 4 estaciones');
    const wSum = knn.reduce((s, k) => s + k.weight, 0);
    if (Math.abs(wSum - 1.0) > 1e-4) throw new Error('Pesos K-NN no suman 1.0: ' + wSum);

    // Test AASHTO Traffic & Speed Bumping
    const basePG = computePG(18.50825, -70.00591, { R: 0.98, esals: 1.0, speed: 'fast' });
    const slowPG = computePG(18.50825, -70.00591, { R: 0.98, esals: 1.0, speed: 'slow' });
    const extPG = computePG(18.50825, -70.00591, { R: 0.98, esals: 35.0, speed: 'fast' });
    if (basePG.bumping !== 0 || basePG.PG_alto_ajustado !== basePG.PG_alto) throw new Error('Error en basePG');
    if (slowPG.bumping !== 1 || slowPG.PG_alto_ajustado !== basePG.PG_alto + 6) throw new Error('Error en slowPG bumping +1: ' + slowPG.PG_alto_ajustado);
    if (extPG.bumping !== 2 || extPG.PG_alto_ajustado !== basePG.PG_alto + 12) throw new Error('Error en extPG bumping +2: ' + extPG.PG_alto_ajustado);

    // Test Heatmap switching
    state.heatMethod = 'voronoi';
    updateHeatmap();
    state.heatMethod = 'kriging';
    updateHeatmap();
    state.heatMethod = 'idw';
    updateHeatmap();

    // Test Geocoding offline lookup
    lookupLocation(18.5, -70.0);
  `, uiCtx);
  console.log('PASS: script id="ui" ejecutado con exito (K-NN, Bumping AASHTO, Voronoi/Kriging, Geocoding y Temas OK)');
} catch (err) {
  console.error('FAIL: script id="ui" arrojo error:', err);
  fails++;
}

process.exit(fails ? 1 : 0);
