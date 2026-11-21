import sys
from PIL import Image
im=Image.open(sys.argv[1]); w,h=im.size; n=int(sys.argv[3]) if len(sys.argv)>3 else 4
part=(h+n-1)//n
out=Image.new('RGB',(w*n+(n-1)*10,part),'#888')
for i in range(n):
    out.paste(im.crop((0,i*part,w,min(h,(i+1)*part))),(i*(w+10),0))
out.save(sys.argv[2],quality=70)
