"""Build site images from the manager's original files (2026-11-25).
usage: python -I scripts/build_pod.py <raw_dir>   (raw_dir/<message id>.jpg, HEIC already converted)
Product photos -> public/images/p/<id>.webp (960x1280, 3:4); editorial -> public/images/ed/<id>.webp
(1440x1920, 3:4; hero shots keep their own aspect, 1440 wide). Then removes images nothing references.
"""
import os, re, sys
from PIL import Image, ImageOps
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
raw = sys.argv[1]
read = lambda p: open(os.path.join(ROOT, p)).read()
products = read('src/data/products.ts')
ids = {int(x) for block in re.findall(r'photos: \[([^\]]*)\]', products) for x in re.findall(r'\d+', block)}
ids |= {int(x) for x in re.findall(r'cover: (\d+)', read('src/lib/catalog.ts'))}
# editorial frames = every edImg(<id>) / ed: <id> / INSTA / hero PHOTOS used in the code
code = ''.join(read(os.path.join(d, f)).replace('\n', ' ') for d, _, fs in os.walk(os.path.join(ROOT, 'src')) for f in fs if f.endswith('.tsx'))
ed = {int(x) for x in re.findall(r'edImg\((\d+)\)|ed: (\d+)', code) for x in x if x}
for name in ('INSTA', 'PHOTOS'):
    for block in re.findall(name + r' = \[([^\]]*)\]', code):
        ed |= {int(x) for x in re.findall(r'\d+', block)}
HERO = {3641, 3642, 3643}

def load(i):
    return ImageOps.exif_transpose(Image.open(f'{raw}/{i}.jpg')).convert('RGB')

def fit34(im, w):
    return ImageOps.fit(im, (w, w * 4 // 3), Image.LANCZOS, centering=(0.5, 0.4))

os.makedirs(f'{ROOT}/public/images/p', exist_ok=True)
os.makedirs(f'{ROOT}/public/images/ed', exist_ok=True)
made = 0
for i in sorted(ids):
    out = f'{ROOT}/public/images/p/{i}.webp'
    if not os.path.exists(f'{raw}/{i}.jpg'):
        if not os.path.exists(out): print('missing', i)
        continue
    fit34(load(i), 960).save(out, 'WEBP', quality=80, method=6); made += 1
for i in sorted(ed):
    out = f'{ROOT}/public/images/ed/{i}.webp'
    if not os.path.exists(f'{raw}/{i}.jpg'):
        if not os.path.exists(out): print('missing ed', i)
        continue
    im = load(i)
    if i in HERO:
        im = im.resize((1440, round(im.height * 1440 / im.width)), Image.LANCZOS)
    else:
        im = fit34(im, 1440)
    im.save(out, 'WEBP', quality=82, method=6)
removed = 0
for sub, keep in (('p', ids), ('ed', ed)):
    for f in os.listdir(f'{ROOT}/public/images/{sub}'):
        if f.endswith('.webp') and int(f[:-5]) not in keep:
            os.remove(f'{ROOT}/public/images/{sub}/{f}'); removed += 1
print(made, 'product photos,', len(ed), 'editorial,', removed, 'unused removed')
