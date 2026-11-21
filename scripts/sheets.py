import json,os,sys
from PIL import Image,ImageDraw
d=json.load(open('tg-all.json'))
posts={}
for x in sorted(d,key=lambda x:x['id']):
    if not x['ph']: continue
    k=x['g'] or x['id']; posts.setdefault(k,[]).append(x['id'])
groups=sorted(posts.values(),key=lambda v:-v[0])
# each sheet: rows of posts; each row up to 10 thumbs 120x160
W,H=120,160
rows=[]
for g in groups: rows.append(g)
os.makedirs('sheets',exist_ok=True)
per=14; n=0
for s in range(0,len(rows),per):
    chunk=rows[s:s+per]
    img=Image.new('RGB',(60+W*10,H*len(chunk)),'white'); dr=ImageDraw.Draw(img)
    for r,g in enumerate(chunk):
        dr.text((4,r*H+70),str(g[0]),fill='black')
        for c,mid in enumerate(g[:10]):
            t=Image.open(f'raw/m/{mid}.jpg').convert('RGB'); t.thumbnail((W,H))
            img.paste(t,(60+c*W,r*H))
            dr.text((62+c*W,r*H+2),str(mid),fill='red')
    img.save(f'sheets/s{n:02d}.jpg',quality=80); n+=1
print(n)
