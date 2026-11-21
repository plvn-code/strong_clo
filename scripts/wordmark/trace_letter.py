"""Trace one letter from the logo and smooth its outline (removes JPEG wobble).
Outputs rings in wordmark units (cap height 100, x from the S's left edge)."""
import sys, json, numpy as np, potrace
from PIL import Image, ImageFilter
xlo, xhi, sigma, out = float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
S=16
im=Image.open('/Users/admin/Desktop/strong/research/wordmark-original.jpg').convert('L').crop((95,205,405,275))
a0=np.array(im).astype(float); lo,hi=np.percentile(a0,.5),np.percentile(a0,70); n=np.clip((a0-lo)/(hi-lo),0,1)
im=Image.fromarray((n*255).astype('uint8')).resize((im.width*S,im.height*S),Image.LANCZOS).filter(ImageFilter.GaussianBlur(S*.4))
a=np.array(im).astype(float)
mn=np.array(Image.fromarray(a.astype('uint8')).filter(ImageFilter.MinFilter(3*S|1)).filter(ImageFilter.GaussianBlur(S*.8))).astype(float)
ink=(a<mn+(255-mn)*.27)&(mn<215)
ys=np.where(ink.any(1))[0]; top,base=ys.min(),ys.max(); H=base-top
x0=np.where(ink.any(0))[0].min()
U=lambda px,py: ((px-x0)/H*100,(py-top)/H*100)
# keep only the letter's columns
xs=np.arange(ink.shape[1]); ux=(xs-x0)/H*100
mask=ink.copy(); mask[:, (ux<xlo)|(ux>xhi)] = False
pl=potrace.Bitmap(~mask).trace(turdsize=80, alphamax=1.3, opticurve=True, opttolerance=0.6)
def bez(p0,c1,c2,p1,k=24):
    tt=np.linspace(0,1,k,endpoint=False)[:,None]
    return (1-tt)**3*p0+3*(1-tt)**2*tt*c1+3*(1-tt)*tt**2*c2+tt**3*p1
rings=[]
for c in pl:
    pts=[]; p=np.array([c.start_point.x,c.start_point.y])
    for g in c.segments:
        e=np.array([g.end_point.x,g.end_point.y])
        if g.is_corner:
            m=np.array([g.c.x,g.c.y]); pts+= [p, m]
        else:
            pts+=list(bez(p,np.array([g.c1.x,g.c1.y]),np.array([g.c2.x,g.c2.y]),e))
        p=e
    P=np.array(pts); P=np.array([U(x,y) for x,y in P])
    # resample uniformly, then periodic gaussian smoothing
    seg=np.r_[0,np.cumsum(np.linalg.norm(np.diff(np.vstack([P,P[:1]]),axis=0),axis=1))]
    L=seg[-1]; m=max(200,int(L/0.15)); s=np.linspace(0,L,m,endpoint=False)
    Q=np.stack([np.interp(s,seg,np.r_[P[:,0],P[0,0]]),np.interp(s,seg,np.r_[P[:,1],P[0,1]])],1)
    if sigma>0:
        k=int(sigma/0.15*3); w=np.exp(-0.5*(np.arange(-k,k+1)*0.15/sigma)**2); w/=w.sum()
        Q=np.stack([np.convolve(np.r_[Q[-k:,i],Q[:,i],Q[:k,i]],w,'valid') for i in (0,1)],1)
    rings.append(Q.round(3).tolist())
json.dump(rings,open(out,'w'))
print(len(rings),'rings', [len(r) for r in rings])
