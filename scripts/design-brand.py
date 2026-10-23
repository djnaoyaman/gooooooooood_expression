"""Regenerate the vector identity and raster exports.

Optional design tooling: Python 3, Pillow, fontTools, Inkscape, Nimbus Sans.
The SVG masters contain outlined lettering and have no font dependencies.
Normal site builds use the committed assets and do not need these tools.
"""
from pathlib import Path
from math import sin, cos, pi
import subprocess
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
ASSETS = DIST / 'assets'
ASSETS.mkdir(exist_ok=True)
INK, PAPER = '#171717', '#f3f2ed'
FONT_DIR = Path('/usr/share/fonts/opentype/urw-base35')
FONTS = {weight: TTFont(FONT_DIR / f'NimbusSans-{weight}.otf') for weight in ['Regular', 'Bold']}

def letters(value, x, y, size, weight='Regular', color=INK, tracking=0):
    font = FONTS[weight]
    glyphs, cmap = font.getGlyphSet(), font.getBestCmap()
    scale = size / font['head'].unitsPerEm
    paths, cursor = [], 0
    for char in value:
        glyph = glyphs[cmap[ord(char)]]
        pen = SVGPathPen(glyphs)
        glyph.draw(pen)
        paths.append(f'<path transform="translate({cursor:.3f} 0)" d="{pen.getCommands()}"/>')
        cursor += glyph.width + tracking / scale
    return f'<g fill="{color}" transform="translate({x} {y}) scale({scale} {-scale})">{"".join(paths)}</g>'

def width(value, size, weight='Bold', tracking=0):
    font=FONTS[weight]
    glyphs,cmap=font.getGlyphSet(),font.getBestCmap()
    return sum(glyphs[cmap[ord(c)]].width for c in value)*size/font['head'].unitsPerEm + tracking*max(0,len(value)-1)


def monogram(box=512, color=PAPER):
    # Keep the approved g*e sequence intact, even at favicon size.
    size=box*(.53 if box<=64 else .45)
    value='g*e'
    x=(box-width(value,size))/2
    return letters(value,x,box*.61,size,'Bold',color,tracking=0)


def wordmark(x,y,size,color=INK):
    return letters('gooooooooood*',x,y,size,'Bold',color,tracking=-size*.025)+letters('expression',x,y+size*1.02,size,'Bold',color,tracking=-size*.025)

def svg(width, height, content):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">{content}</svg>'

def save(name, value):
    path = DIST/name
    path.write_text(value)
    return path

def png(source, target, size=None, flatten=True):
    command = ['inkscape', str(source), '--export-type=png', f'--export-filename={target}']
    if size: command += [f'--export-width={size}', f'--export-height={size}']
    subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    # Flatten alpha intentionally for all home-screen and share graphics.
    image = Image.open(target)
    if image.mode == 'RGBA' and flatten:
        rgb = Image.new('RGB', image.size, PAPER)
        rgb.paste(image, mask=image.getchannel('A'))
        rgb.save(target, optimize=True)

icon = save('assets/brand-icon.svg', svg(512,512, f'<path fill="{INK}" d="M0 0H512V512H0Z"/>'+monogram()))
favicon = save('favicon.svg', svg(64,64,f'<rect width="64" height="64" rx="10" fill="{INK}"/>'+monogram(64)))
save('assets/logo.svg',svg(1000,292,wordmark(0,112,130)))
save('assets/logo-light.svg',svg(1000,292,wordmark(0,112,130,PAPER)))
save('assets/logo-short.svg',svg(512,512,monogram(512,INK)))
for size in [16,32,48]: png(favicon, DIST/f'favicon-{size}.png',size,flatten=False)
for name,size in [('apple-touch-icon',180),('apple-touch-icon-167',167),('apple-touch-icon-152',152),('icon-192',192),('icon-512',512),('icon-maskable-512',512)]:
    png(icon,DIST/f'{name}.png',size)
Image.open(DIST/'favicon-48.png').save(DIST/'favicon.ico',sizes=[(16,16),(32,32),(48,48)],append_images=[Image.open(DIST/f'favicon-{n}.png') for n in [16,32]])

def poster(height=630):
    s=f'<path fill="{PAPER}" d="M0 0H1200V{height}H0Z"/>'
    s+=letters('THE WEB EXPRESSION LIBRARY',64,82,16,tracking=1.1)
    s+=letters('g*e',1055,87,40,'Bold')
    s+=f'<path d="M64 113H1136" stroke="{INK}" stroke-width="1"/>'
    s+=wordmark(60,295,140)
    baseline=height-58
    s+=f'<path d="M64 {baseline-40}H1136" stroke="{INK}" stroke-width="1"/>'
    s+=letters('LOOK. FEEL. MAKE.',64,baseline,17,'Bold',tracking=1.1)
    s+=letters('MOTION / EASING / SCROLL / SOUND / COLOR',653,baseline,14,tracking=.6)
    return svg(1200,height,s)

og=save('assets/og-expression-v2.svg',poster())
png(og,ASSETS/'og-expression-v2.png')
tw=save('assets/social-expression-v2.svg',poster(600))
png(tw,ASSETS/'social-expression-v2.png')
# Keep the prior URL functional for previously cached links.
Image.open(ASSETS/'og-expression-v2.png').save(ASSETS/'og-image.png',optimize=True)

# A review board: real exported assets, including favicon at actual pixel size.
board = Image.new('RGB',(1440,1120),PAPER)
d = ImageDraw.Draw(board)
font = lambda n, bold=False: ImageFont.truetype(str(FONT_DIR/f'NimbusSans-{"Bold" if bold else "Regular"}.otf'),n)
d.text((64,48),'gooooooooood expression',font=font(34,True),fill=INK)
d.text((64,99),'IDENTITY / 02      TYPOGRAPHIC SIGNATURE',font=font(15),fill='#666666')
d.line((64,144,1376,144),fill='#b8b7b3')
board.paste(Image.open(DIST/'apple-touch-icon.png'),(64,190))
d.text((64,395),'APPLE TOUCH ICON',font=font(16,True),fill=INK)
d.text((64,423),'180 x 180 / opaque PNG',font=font(14),fill='#666666')
d.rounded_rectangle((330,190,834,268),radius=12,fill='white')
board.paste(Image.open(DIST/'favicon-16.png'),(352,221),Image.open(DIST/'favicon-16.png'))
d.text((380,215),'gooooooooood expression',font=font(20),fill=INK)
d.rounded_rectangle((330,286,834,364),radius=12,fill=INK)
board.paste(Image.open(DIST/'favicon-32.png'),(350,308),Image.open(DIST/'favicon-32.png'))
d.text((400,311),'gooooooooood expression',font=font(20),fill=PAPER)
d.text((330,395),'FAVICON / ACTUAL PIXEL SIZE',font=font(16,True),fill=INK)
d.text((330,423),'16px + 32px / light & dark surfaces',font=font(14),fill='#666666')
d.text((943,192),'ONE IDEA.',font=font(33,True),fill=INK)
d.text((943,236),'EVERY SURFACE.',font=font(33,True),fill=INK)
d.text((943,300),'Full name. Two lines.',font=font(18),fill='#666666')
d.text((943,330),'g*e for small spaces.',font=font(18),fill='#666666')
d.text((943,360),'One typographic identity.',font=font(18),fill='#666666')
card = Image.open(ASSETS/'og-expression-v2.png').resize((1080,567),Image.Resampling.LANCZOS)
board.paste(card,(64,490))
d.rectangle((63,489,1144,1057),outline='#b8b7b3')
d.text((1174,505),'OGP',font=font(18,True),fill=INK)
d.text((1174,537),'1200 x 630',font=font(15),fill='#666666')
d.text((1174,575),'STATIC PNG',font=font(13),fill='#666666')
(ROOT/'docs').mkdir(exist_ok=True)
board.save(ROOT/'docs/brand-preview.png',optimize=True)
print('Generated outlined SVG masters, favicon, Apple/PWA icons, share images and review board.')
