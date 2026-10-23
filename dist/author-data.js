// Verified against the author's public GitHub repository sources, 2026-10-24.
export const author = {
  name: '宮崎直哉', english: 'MIYAZAKI Naoya', alias: 'DJ Naoyaman',
  introduction: 'マーケティングとブランディングを本業に、音楽、妖怪、鎌倉、サウナ、漢字など、気になったものを調べ、編集し、Webサイトとして公開しています。音楽ではDJ Naoyaman名義で活動しています。',
  profile: 'https://djnaoyaman.github.io/cratediggin/editor.html', github: 'https://github.com/djnaoyaman'
};
export const works = [
  ['cratediggin', 'CRATE DIGGIN’', 'Hip Hopを中心に、楽曲からサンプル、プロデューサー、街や時代をたどる音楽アーカイブ。', 'MUSIC / ARCHIVE', 'CRATE<br>DIGGIN’', ''],
  ['sanreikotaiyoku', '酸冷交代浴のススメ', '炭酸泉と水風呂の楽しみ方を、体験、施設紹介、文献から編集するサイト。', 'BATHING / GUIDE', '酸冷<br>交代浴', ''],
  ['youkai', '一見坊の【日本妖怪学体系】', '各地の妖怪と伝承を、出典や信頼度とともに読み解く図鑑。', 'FOLKLORE / ENCYCLOPEDIA', '日本<br>妖怪学体系', ''],
  ['sakanamushi', '花鳥風月、そして魚と虫', '魚・虫・鳥・植物にまつわる漢字を、大きな文字とクイズで楽しむ図鑑。', 'KANJI / DISCOVERY', '花鳥風月<br>魚と虫', ''],
  ['kuranpo', '鎌・くらんぽ', '鎌倉の社寺と歴史を、出発点から解散点までの散歩コースに編むガイド。', 'KAMAKURA / WALK', '鎌・<br>くらんぽ', ''],
  ['suburbia-classica', 'SUBURBIA CLASSICA', 'クラシックの名曲を、制作背景や構成、録音エピソードとともに聴く選曲サイト。', 'CLASSICAL / SELECTION', 'SUBURBIA<br>CLASSICA', ''],
  ['chems', 'my Chems', 'The Chemical Brothersの作品を、出典つきの記録と私見でたどる日英の非公式アーカイブ。', 'MUSIC / FAN ARCHIVE', 'my<br>Chems', ''],
  ['ppp', '掌蹠膿疱症.com', '掌蹠膿疱症について、個人の記録と公開資料をもとに治療の選択肢を整理するサイト。', 'HEALTH / PERSONAL RECORD', '掌蹠<br>膿疱症.com', 'index.html'],
  ['bookkeeping', 'Book Keeping', '日商簿記・全経簿記・USCPAの仕訳と計算を反復演習し、復習につなげる学習サイト。', 'ACCOUNTING / LEARNING', 'Book<br>Keeping', '']
].map(([id,name,description,category,lettering,path])=>({id,name,description,category,lettering,url:`https://djnaoyaman.github.io/${id}/${path}`,repository:`https://github.com/djnaoyaman/${id}`}));

