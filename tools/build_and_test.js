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
process.exit(fails ? 1 : 0);
