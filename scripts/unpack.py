import json,sys,os
src,out=sys.argv[1],sys.argv[2]
os.makedirs(out,exist_ok=True)
b=open(src,'rb').read(); hl=int(b[:10]); idx=json.loads(b[10:10+hl]); base=10+hl
for e in idx: open(f"{out}/{e['mid']}.jpg",'wb').write(b[base+e['off']:base+e['off']+e['len']])
print(len(idx))
