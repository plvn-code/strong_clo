"""Build site images from raw Telegram photos.
usage: python -I scripts/build_images.py <raw_dir>   (raw_dir has y/ = 960x1280, w/ = 1920x2560)
Product photos -> public/images/p/<id>.webp (960x1280, 3:4); editorial -> public/images/ed/<id>.webp (1440x1920).
"""
import os, re, sys
from PIL import Image, ImageOps
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
raw = sys.argv[1]
src = open(os.path.join(ROOT, 'src/data/products.ts')).read()
ids = sorted({int(x) for block in re.findall(r'photos: \[([^\]]*)\]', src) for x in re.findall(r'\d+', block)})
ED = [4011, 4012, 4013, 4010, 4024, 4001, 4004, 4007, 4015, 352, 676, 678, 706, 707, 1300, 1303, 1305, 360, 382, 394, 455, 461, 463, 347, 349, 350, 391, 392]

def fit34(im, w):
    im = ImageOps.exif_transpose(im).convert('RGB')
    return ImageOps.fit(im, (w, w * 4 // 3), Image.LANCZOS, centering=(0.5, 0.45))

os.makedirs(f'{ROOT}/public/images/p', exist_ok=True)
os.makedirs(f'{ROOT}/public/images/ed', exist_ok=True)
for i in ids:
    p = f'{raw}/y/{i}.jpg'
    if not os.path.exists(p): print('missing', i); continue
    fit34(Image.open(p), 960).save(f'{ROOT}/public/images/p/{i}.webp', 'WEBP', quality=80, method=6)
for i in ED:
    p = f'{raw}/w/{i}.jpg'
    if not os.path.exists(p): print('missing ed', i); continue
    fit34(Image.open(p), 1440).save(f'{ROOT}/public/images/ed/{i}.webp', 'WEBP', quality=80, method=6)
print(len(ids), 'product photos,', len(ED), 'editorial')
