"""STRONG wordmark — clean vector rebuild of the client's logo (proportions measured from
research/wordmark-original.jpg). Cap height 100 units, baseline y=100."""
import math, numpy as np
from shapely.geometry import Polygon, Point, box
from shapely.ops import unary_union
from shapely import affinity

T, t = 6.0, 2.2          # thick / hairline

def ellipse(cx, cy, rx, ry):
    return affinity.scale(Point(0, 0).buffer(1, resolution=512), rx, ry).__class__(
        [(cx + x * rx, cy + y * ry) for x, y in np.array(Point(0, 0).buffer(1, resolution=512).exterior.coords)])

def ring(cx, cy, rx, ry, tx=T, ty=t):
    return ellipse(cx, cy, rx, ry).difference(ellipse(cx, cy, rx - tx, ry - ty))

def catmull(pts, n=60, alpha=0.5):
    """centripetal Catmull-Rom through pts (endpoints duplicated)"""
    P = [np.array(p, float) for p in pts]
    P = [2 * P[0] - P[1]] + P + [2 * P[-1] - P[-2]]
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        t0 = 0
        t1 = t0 + np.linalg.norm(p1 - p0) ** alpha
        t2 = t1 + np.linalg.norm(p2 - p1) ** alpha
        t3 = t2 + np.linalg.norm(p3 - p2) ** alpha
        for u in np.linspace(t1, t2, n, endpoint=False):
            a1 = (t1 - u) / (t1 - t0) * p0 + (u - t0) / (t1 - t0) * p1
            a2 = (t2 - u) / (t2 - t1) * p1 + (u - t1) / (t2 - t1) * p2
            a3 = (t3 - u) / (t3 - t2) * p2 + (u - t2) / (t3 - t2) * p3
            b1 = (t2 - u) / (t2 - t0) * a1 + (u - t0) / (t2 - t0) * a2
            b2 = (t3 - u) / (t3 - t1) * a2 + (u - t1) / (t3 - t1) * a3
            out.append((t2 - u) / (t2 - t1) * b1 + (u - t1) / (t2 - t1) * b2)
    out.append(P[-2])
    return np.array(out)

def contrast_stroke(pts, thick=T, thin=t, p=1.6, n=80, spine=0.0):
    """variable-width stroke: width follows the tangent (vertical = thick, horizontal = thin)"""
    c = catmull(pts, n)
    d = np.gradient(c, axis=0)
    d /= np.linalg.norm(d, axis=1)[:, None]
    nrm = np.stack([-d[:, 1], d[:, 0]], 1)
    seg = np.r_[0, np.cumsum(np.linalg.norm(np.diff(c, axis=0), axis=1))]
    sfrac = seg / seg[-1]
    bump = spine * np.exp(-((sfrac - 0.5) / 0.11) ** 2)        # thick S spine
    w = thin + (thick - thin) * np.maximum(np.abs(d[:, 1]) ** p, bump)
    # smooth the width a little
    k = np.ones(9) / 9
    w = np.convolve(np.pad(w, 4, mode='edge'), k, mode='valid')
    L = c + nrm * (w / 2)[:, None]
    R = c - nrm * (w / 2)[:, None]
    return Polygon(np.vstack([L, R[::-1]])).buffer(0)

def quad(*pts):
    return Polygon(pts)

parts = []
# ── S (x 0 … 76.5)
import json
S = Polygon(json.load(open(__import__('os').path.join(__import__('os').path.dirname(__file__), 'S.json')))[0]).buffer(0)
parts.append(S)
# ── T (x 98.2 … 171)
x = 98.2
parts += [box(x, 0, x + 72.8, 2.5), box(x + 33.4, 0, x + 39.5, 100),
          quad((x, 0), (x + 1.2, 0), (x + 1.2, 3.6), (x, 3.3)), quad((x + 72.8, 0), (x + 71.6, 0), (x + 71.6, 3.6), (x + 72.8, 3.3))]
# ── R (x 196.4 … 269.6)
x = 196.4
bowl = contrast_stroke([(x + 3, 0.95), (x + 38, 0.95), (x + 62.5, 6), (x + 69.2, 23.5), (x + 62.5, 42.5), (x + 38, 51.3), (x + 3, 51.3)], thick=7.4)
leg = quad((x + 29.5, 50), (x + 37.6, 50), (x + 73.4, 100), (x + 65.0, 100))
parts += [box(x, 0, x + 6.3, 100), bowl, leg]
# ── O (x 289.9 … 383.9)
cx = 289.9 + 47
parts.append(ring(cx, 50, 47, 50.7))
# ── N (x 408.1 … 482.1)
x = 408.1
N = unary_union([
    quad((x + 0.4, 0), (x + 2.6, 0), (x + 6.7, 100), (x + 0.6, 100)),
    quad((x - 2.3, 0), (x + 5.4, 0), (x + 76.1, 100), (x + 68.4, 100)),
    quad((x + 67.4, 0), (x + 73.4, 0), (x + 74.0, 100), (x + 72.0, 100)),
]).intersection(box(x, 0, x + 74, 100))
parts.append(N)
# ── G (x 506.1 … 589.5)
x = 506.1
gx = x + 45.2
G = ring(gx, 50, 45.2, 50.7)
G = G.difference(box(gx + 14, 21.5, gx + 60, 70)).difference(box(gx + 7, 70, gx + 60, 103))
tail = contrast_stroke([(gx + 4, 99.6), (gx + 19, 97.9), (gx + 29.2, 92.2), (gx + 33.8, 81.5), (gx + 34.6, 64), (gx + 34.6, 47)], thick=6.6, n=120)
G = unary_union([G, tail]).intersection(box(x - 1, 46.5, x + 90, 102)).union(G.intersection(box(x - 1, -2, x + 90, 46.5)))
G = G.buffer(-1.1, resolution=32).buffer(1.1, resolution=32)      # soft terminals like the logo
parts.append(G)

wm = unary_union(parts)
wm = wm.buffer(-0.35, resolution=24).buffer(0.35, resolution=24)   # soften every corner a touch
minx, miny, maxx, maxy = wm.bounds
print('bounds', [round(v, 2) for v in wm.bounds])

def ring_path(coords):
    c = np.array(coords)
    return 'M' + 'L'.join(f'{x - minx:.2f} {y:.2f}' for x, y in c[:-1]) + 'Z'

geoms = getattr(wm, 'geoms', [wm])
d = ''
for g in geoms:
    g = g.simplify(0.02)
    d += ring_path(g.exterior.coords) + ''.join(ring_path(i.coords) for i in g.interiors)
W = maxx - minx
open('wordmark.svg', 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 {miny:.2f} {W:.2f} {maxy - miny:.2f}"><path fill-rule="evenodd" d="{d}"/></svg>')
print('W', round(W, 2), 'len', len(d))
