"""Preprocesa data_temp_RD.txt en series anuales por estación (embebidas en el HTML)
y calcula los resultados de referencia con la MISMA lógica del notebook
(PG RepDominicana.ipynb) para la tabla de verificación del Punto D.

Uso:  python tools/preprocess_and_verify.py
Salidas: tools/annual_series.json, tools/verificacion_python.json
"""
import json
import os
from math import log10

import pandas as pd
from scipy.stats import norm

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

est = pd.read_csv(os.path.join(ROOT, 'estaciones_RD.txt'), sep='\t')
raw = pd.read_csv(os.path.join(ROOT, 'data_temp_RD.txt'), sep='\t')
raw['DAY'] = pd.to_datetime(raw['DAY'])
raw['YEAR'] = raw['DAY'].dt.year

stations = []
for _, s in est.iterrows():
    sid = int(s['MERRA_ID'])
    df = raw[raw['MERRA_ID'] == sid].copy()
    if df.empty:
        continue  # 118835 y 121135 no tienen datos de temperatura
    # Notebook celda 9: rolling en el ORDEN ORIGINAL del archivo
    df['T7_FILE'] = df['TEMP_MAX'].rolling(window=7, min_periods=7).mean()
    # Variante corregida: rolling con fechas en orden cronológico
    ds = df.sort_values('DAY').copy()
    ds['T7_SORT'] = ds['TEMP_MAX'].rolling(window=7, min_periods=7).mean()
    # Notebook celda 18: grados-día sobre 10 °C
    df['DDAY'] = ((df['TEMP_MAX'] + df['TEMP_MIN']) / 2 - 10).clip(lower=0)
    y = df.groupby('YEAR').agg(T7_FILE=('T7_FILE', 'max'), TMIN=('TEMP_MIN', 'min'),
                               DD=('DDAY', 'sum'))
    y['T7_SORT'] = ds.groupby('YEAR')['T7_SORT'].max()
    y = y.sort_index()
    stations.append({
        'id': sid, 'lat': float(s['LATITUDE']), 'lon': float(s['LONGITUDE']),
        'elev': int(s['ELEVATION']), 'years': [int(v) for v in y.index],
        't7f': [round(float(v), 6) for v in y['T7_FILE']],
        't7s': [round(float(v), 6) for v in y['T7_SORT']],
        'tmin': [float(v) for v in y['TMIN']],
        'dd': [round(float(v), 4) for v in y['DD']],
    })

with open(os.path.join(HERE, 'annual_series.json'), 'w', encoding='utf-8') as f:
    json.dump(stations, f, separators=(',', ':'))

PG_MAX = [52, 58, 64, 70, 76, 82, 88, 94, 100]
PG_MIN = [-10, -16, -22, -28, -34, -40, -46, -52, -58]


def compute(lat, lon, R, R_ah, order='t7f'):
    st = min(stations, key=lambda s: ((s['lat'] - lat) ** 2 + (s['lon'] - lon) ** 2) ** 0.5)
    t7 = pd.Series(st[order]); tmin = pd.Series(st['tmin']); dd = pd.Series(st['dd'])
    Tmax, Tmin = t7.mean(), tmin.mean()
    smax, smin = t7.std(), tmin.std()
    z = norm.ppf(R)
    Tpav = 54.32 + 0.78 * Tmax - 0.0025 * lat ** 2 - 15.14 * log10(20 + 25)
    spav = (9 + 0.61 * smax ** 2) ** 0.5
    Talto = Tpav + z * spav
    pg_alto = next((p for p in PG_MAX if p >= Talto), PG_MAX[-1])
    Tpb = -1.56 + 0.72 * Tmin - 0.004 * lat ** 2 + 6.26 * log10(0 + 25)
    spb = (4.4 + 0.52 * smin ** 2) ** 0.5
    Tbajo = Tpb - norm.ppf(R) * spb
    pg_bajo = min(PG_MIN, key=lambda p: abs(p - Tbajo))
    DD = dd.mean() / 1000.0
    RD = 10.0
    PGHd = 48.2 + 14 * DD - 0.96 * DD ** 2 - 2 * RD
    CVPG = 0.000034 * (lat - 20) ** 2 * RD ** 2
    PGHrel = PGHd + norm.ppf(R_ah) * (PGHd * CVPG / 100.0)
    pg_ah = next((p for p in PG_MAX if p >= PGHrel), PG_MAX[-1])
    return {'lat': lat, 'lon': lon, 'R': R, 'R_ah': R_ah, 'station': st['id'],
            'Tmax': Tmax, 'Tmin': Tmin, 'smax': smax, 'smin': smin,
            'T_pav_alto': Talto, 'PG_alto': pg_alto, 'T_pav_bajo': Tbajo,
            'PG_bajo': pg_bajo, 'DD': DD, 'PG_H_rel': PGHrel, 'PG_ah': pg_ah}


CASES = [
    (18.50825, -70.00591, 0.98, 0.50),  # caso del notebook
    (19.45070, -70.69700, 0.98, 0.50),  # Santiago de los Caballeros
    (18.42700, -68.97200, 0.50, 0.50),  # La Romana
    (18.20800, -71.10000, 0.98, 0.98),  # Barahona
    (19.79000, -70.69000, 0.90, 0.90),  # Puerto Plata
]
res = [compute(*c) for c in CASES]
with open(os.path.join(HERE, 'verificacion_python.json'), 'w', encoding='utf-8') as f:
    json.dump(res, f, indent=1)
for r in res:
    print({k: (round(v, 4) if isinstance(v, float) else v) for k, v in r.items()})
