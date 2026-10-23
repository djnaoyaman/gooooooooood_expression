"""Generate the original, silent motion study used by the video laboratories."""
from pathlib import Path
from tempfile import TemporaryDirectory
from PIL import Image, ImageDraw, ImageFont
import subprocess, math, base64, json
root=Path(__file__).resolve().parent.parent
assets=root/'dist/assets'
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',40)
small=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',10)
with TemporaryDirectory(prefix='ge-frames-') as tmp:
    for i in range(72):
        t=i/72*math.tau
        im=Image.new('RGB',(320,180),'#e9e7df');d=ImageDraw.Draw(im)
        d.text((17,65),'good.',font=font,fill='#292929')
        d.text((19,20),'AN ORIGINAL MOTION STUDY',font=small,fill='#666666')
        d.line((18,151,302,151),fill='#b6b4ac')
        d.ellipse((179,30,301,152),outline='#bab8b0',width=1)
        x=240+math.cos(t)*49;y=91+math.sin(t)*49
        d.ellipse((x-13,y-13,x+13,y+13),fill='#333333')
        d.rectangle((230,81,250,101),fill='#99978f')
        im.save(Path(tmp)/f'{i:03d}.png')
        if i==0:im.save(assets/'lab-motion-poster.png')
    subprocess.run(['ffmpeg','-v','error','-y','-framerate','24','-i',str(Path(tmp)/'%03d.png'),'-c:v','libx264','-pix_fmt','yuv420p','-crf','25','-movflags','+faststart',str(assets/'lab-motion.mp4')],check=True)
data='data:video/mp4;base64,'+base64.b64encode((assets/'lab-motion.mp4').read_bytes()).decode()
(root/'dist/media-data.js').write_text('export const motionVideo='+json.dumps(data)+';\n')
print('Generated original 3-second silent MP4 and embedded sample data.')

with (root/"dist/media-data.js").open("a") as output:
    output.write("\nexport const motionPoster=\"data:image/png;base64,"+base64.b64encode((root/"dist/assets/lab-motion-poster.png").read_bytes()).decode()+"\";\n")

subprocess.run(['ffmpeg','-v','error','-y','-i',str(assets/'lab-motion.mp4'),'-c:v','libvpx-vp9','-b:v','0','-crf','32',str(assets/'lab-motion.webm')],check=True)
with (root/'dist/media-data.js').open('a') as output:
    output.write('export const motionWebm='+json.dumps('data:video/webm;base64,'+base64.b64encode((assets/'lab-motion.webm').read_bytes()).decode())+';\n')
