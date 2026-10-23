import { explorations } from './explorations.js';
import { motions } from './motions.js';
import { expressions } from './expressions.js';
import { easings, easingPath, mountEasingLab } from './easings.js';
import { sounds, mountSound } from './sounds.js';
import { advanced } from './advanced.js';
import { scrollExpressions } from './scroll-expressions.js';
export const categories=[['motion','↗','アニメーション','MOTION'],['easing','⌁','イージング','EASING'],['scroll','↕','スクロール・視差','SCROLL'],['color','◉','色・配色','COLOR'],['gradient','◒','グラデーション','GRADIENT'],['type','Aa','タイポグラフィ','TYPOGRAPHY'],['layout','▦','レイアウト・余白','LAYOUT'],['shape','◇','形・線・輪郭','SHAPE'],['shadow','◐','影・光・奥行き','SHADOW'],['texture','▧','質感・合成','TEXTURE'],['image','▣','写真・画像表現','IMAGE'],['svg','⌘','SVG・アイコン','SVG'],['ui','⊞','UIパーツ','UI'],['interaction','☝','操作・反応','INTERACTION'],['data','▥','データの見せ方','DATA'],['three','⬡','3D・立体表現','3D'],['sound','♪','音・サウンド','SOUND'],['media','▷','映像の見せ方','MEDIA'],['style','✳','デザイン様式','STYLE']];
export const all=[...motions,...expressions,...easings,...sounds,...advanced,...scrollExpressions,...explorations], byId=new Map(all.map(e=>[e.id,e]));
