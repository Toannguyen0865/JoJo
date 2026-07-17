const fs = require('fs');
const dbPath = './client/src/data/database.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const translations = {
  // Parts 3-6 Stands
  "Star Platinum": "スタープラチナ",
  "Hermit Purple": "ハーミットパープル",
  "Magician's Red": "マジシャンズレッド",
  "Hierophant Green": "ハイエロファントグリーン",
  "Silver Chariot": "シルバーチャリオッツ",
  "The Fool": "ザ・フール",
  "The World": "ザ・ワールド",
  "Tower of Gray": "タワー・オブ・グレー",
  "Dark Blue Moon": "ダークブルームーン",
  "Strength": "ストレングス",
  "Ebony Devil": "エボニーデビル",
  "Yellow Temperance": "イエローテンパランス",
  "Hanged Man": "ハングドマン",
  "Emperor": "エンペラー",
  "Empress": "エンプレス",
  "Wheel of Fortune": "ホイル・オブ・フォーチュン",
  "Justice": "ジャスティス",
  "Lovers": "ラバーズ",
  "Sun": "サン",
  "Death Thirteen": "デス・サーティーン",
  "Judgement": "ジャッジメント",
  "High Priestess": "ハイプリエステス",
  "Geb": "ゲブ神",
  "Khnum": "クヌム神",
  "Tohth": "トト神",
  "Anubis": "アヌビス神",
  "Bastet": "バステト女神",
  "Sethan": "セト神",
  "Osiris": "オシリス神",
  "Horus": "ホルス神",
  "Atum": "アトゥム神",
  "Tenore Sax": "ティナー・サックス",
  "Cream": "クリーム",
  "Crazy Diamond": "クレイジー・ダイヤモンド",
  "Echoes": "エコーズ",
  "The Hand": "ザ・ハンド",
  "Heaven's Door": "ヘブンズ・ドアー",
  "Killer Queen": "キラークイーン",
  "Aqua Necklace": "アクア・ネックレス",
  "Bad Company": "バッド・カンパニー",
  "The Lock": "ザ・ロック",
  "Surface": "サーフィス",
  "Love Deluxe": "ラブ・デラックス",
  "Red Hot Chili Pepper": "レッド・ホット・チリ・ペッパー",
  "Ratt": "ラット",
  "Harvest": "ハーヴェスト",
  "Atom Heart Father": "アトム・ハート・ファーザー",
  "Boy II Man": "ボーイ・II・マン",
  "Earth Wind and Fire": "アース・ウィンド・アンド・ファイヤー",
  "Highway Star": "ハイウェイ・スター",
  "Stray Cat": "ストレイ・キャット",
  "Super Fly": "スーパーフライ",
  "Enigma": "エニグマ",
  "Cheap Trick": "チープ・トリック",
  "Pearl Jam": "パール・ジャム",
  "Achtung Baby": "アクトン・ベイビー",
  "Cinderella": "シンデレラ",
  "Gold Experience": "ゴールド・エクスペリエンス",
  "Gold Experience Requiem": "ゴールド・エクスペリエンス・レクイエム",
  "Sticky Fingers": "スティッキィ・フィンガーズ",
  "Moody Blues": "ムーディー・ブルース",
  "Sex Pistols": "セックス・ピストルズ",
  "Aerosmith": "エアロスミス",
  "Purple Haze": "パープル・ヘイズ",
  "Spice Girl": "スパイス・ガール",
  "Mr.President": "ミスター・プレジデント",
  "King Crimson": "キング・クリムゾン",
  "Black Sabbath": "ブラック・サバス",
  "Soft Machine": "ソフト・マシーン",
  "Kraft Work": "クラフト・ワーク",
  "Little Feet": "リトル・フィート",
  "Man in the Mirror": "マン・イン・ザ・ミラー",
  "The Grateful Dead": "ザ・グレイトフル・デッド",
  "Beach Boy": "ビーチ・ボーイ",
  "Baby Face": "ベイビィ・フェイス",
  "White Album": "ホワイト・アルバム",
  "Clash": "クラッシュ",
  "Talking Head": "トーキング・ヘッド",
  "Notorious B.I.G": "ノトーリアス・B・I・G",
  "Green Day": "グリーン・ディ",
  "Oasis": "オアシス",
  "Rolling Stones": "ローリング・ストーンズ",
  "Stone Free": "ストーン・フリー",
  "Kiss": "キッス",
  "Burning Down the House": "バーニング・ダウン・ザ・ハウス",
  "Weather Report": "ウェザー・リポート",
  "Diver Down": "ダイバー・ダウン",
  "Whitesnake": "ホワイトスネイク",
  "C-MOON": "C-MOON",
  "Made in Heaven": "メイド・イン・ヘブン",
  "Goo Goo Dolls": "グーグー・ドールズ",
  "Manhattan Transfer": "マンハッタン・トランスファー",
  "Highway to Hell": "ハイウェイ・トゥ・ヘル",
  "Marilyn Manson": "マリリン・マンソン",
  "Foo Fighters": "フー・ファイターズ",
  "Boiling Water Stand": "熱湯を操るスタンド",
  "Metallica": "メタリカ",
  
  // Proper character names (English left in ja)
  "Dire": "ダイアー",
  "Tarkus": "タルカス",
  "Poco": "ポコ",
  "Wamuu": "ワムウ",
  "Santana": "サンタナ",
  "Bruto": "ブルート",
  "Nukesaku": "ヌケサク",
  "ZZ": "ズィー・ズィー",
  "Leaky-Eye Luca": "涙目のルカ",
  "Sadao Kujo": "空条 貞夫",
  "Shozo Mayama": "真山 祥三",
  "Tatsuhiko": "達彦",
  "Yoshimura": "吉村",
  "Kenichi": "健一",
  "Pi-chan": "ピーちゃん"
};

const descriptiveTranslations = {
  // Minor descriptive characters
  "Woman from a Bar": "酒場の女",
  "Carriage Driver": "馬車の御者",
  "Rugby Players": "ラグビー選手",
  "Man with Birthmark": "星型の痣を持つ男",
  "Vagrants": "浮浪者",
  "Scotland Yard Police Officers": "スコットランドヤードの警官",
  "Fisherman": "漁師",
  "Executioner": "死刑執行人",
  "Indian Doctor": "インド人の医者",
  "London Bartender": "ロンドンのバーテンダー",
  "New York Police Officers": "ニューヨークの警官",
  "Impatient Driver": "せっかちな運転手",
  "Female Reporter": "女性記者",
  "Nazi Doctors": "ナチスの医師",
  "Courageous Mexican Child": "勇敢なメキシコ人の子供",
  "Mexican Thugs": "メキシコ人のチンピラ",
  "Vampire Prisoner": "吸血鬼の囚人",
  "Nazi Gatekeepers": "ナチスの門番",
  "Nazi Researcher": "ナチスの研究員",
  "SPW Researchers": "SPW財団の研究員",
  "Rome Hotel Waiter": "ローマのホテルのウェイター",
  "Hypnotized Girl": "催眠術をかけられた少女",
  "Nazi Officer": "ナチス将校",
  "Nazi Spy": "ナチスのスパイ",
  "Postmaster": "郵便局長",
  "Drunk Drivers": "飲酒運転手",
  "Luxury Cat": "高級猫",
  "Italian Hoodlum": "イタリアのチンピラ",
  "Bad Breath Vampire": "口臭のひどい吸血鬼",
  "Funeral Directors": "葬儀屋",
  "Japanese Tourist": "日本人の観光客",
  "Sick Punks": "病気の不良たち",
  "Female Tourists": "女性観光客",
  "Gelato Stand Worker": "ジェラート屋の店員",
  "Unlicensed Taxi Driver": "白タクの運転手",
  "Airport Security": "空港の警備員",
  "Angry Child": "怒った子供",
  "Female Prison Officer": "女性刑務官",
  "Old Janitor": "年老いた清掃員",
  "Naples Gangsters": "ナポリのギャング",
  "Yacht Renter": "ヨットの貸し手",
  "Truck Driver": "トラック運転手",
  "Assassination Target": "暗殺ターゲット",
  "Assassinated Woman": "暗殺された女性",
  "Elderly Victim": "高齢の被害者",
  "Blackmailing Criminal": "恐喝犯",
  "Shady Engineer": "怪しいエンジニア",
  "Drug Dealers": "麻薬密売人",
  "Bug-Catching Boy": "虫取りの少年",
  "Sardinian Fortune Teller": "サルデーニャ島の占い師",
  "Sardinian Taxi Driver": "サルデーニャ島のタクシー運転手",
  "Drunkards": "酔っ払い",
  "Toy Telephone Girl": "おもちゃの電話の少女",
  "Female Prison Guards": "女性刑務官",
  "Delirious Man": "うわ言を言う男",
  "Little Girl With Doll": "人形を持った少女",
  "Flower Shop Owner": "花屋の店主",
  "Escort Policeman": "護送中の警官",
  "Strip Search Staff": "身体検査の係員",
  "Prison Doctor": "刑務所の医師",
  "Transgender Prisoner": "トランスジェンダーの囚人",
  "Prison Hairdresser": "刑務所の美容師",
  "Female Ward Security Staff": "女子棟の警備員",
  "Blonde Bully": "金髪のいじめっ子",
  "Bullied Prisoner": "いじめられている囚人",
  "Prison Visit Guard": "面会室の警備員",
  "Suicidal Woman": "自殺志願の女性",
  "Missing Prisoners": "行方不明の囚人",
  "Search Party Guard": "捜索隊の警備員",
  "Shaved-Head Prisoner": "坊主頭の囚人",
  "Black-Haired Prisoner": "黒髪の囚人",
  "Tanned Prisoner": "日焼けした囚人",
  "Courtyard Guard": "中庭の警備員",
  "Speedwagon Foundation Representative": "SPW財団の代表者",
  "Factory Guard": "工場の警備員",
  "Surveillance Technician": "監視カメラの技術者",
  "Brainwashed Courtyard Guard": "洗脳された中庭の警備員",
  "Blinded Courtyard Guard": "目を潰された中庭の警備員",
  "Invisible Alligator": "透明なワニ",
  "Ultra Security House Unit Prisoners": "厳正懲罰隔離房の囚人",
  "Group of Hikers": "ハイカーのグループ",
  "Mountain Investigation Team": "山岳調査隊",
  "Little Prisoner": "小さな囚人",
  "Shoplifter": "万引き犯",
  "Elderly Former Carpenter": "年老いた元大工",
  "Seven Dwarfs": "7人の小人",
  "Snow White": "白雪姫",
  "Astro Boy": "鉄腕アトム",
  "Tetsujin 28-go": "鉄人28号",
  "Little Red Riding Hood": "赤ずきん",
  "Chocolate Store Clerk": "チョコレート屋の店員",
  "Venus": "ヴィーナス",
  "The Genie": "ランプの魔人",
  "Book-Reading Girl": "本を読む少女",
  "Fighter Jet Pilot": "戦闘機のパイロット",
  "Professional Thief": "プロの泥棒",
  "Juvenile Detention Inmate": "少年院の収容者",
  "Racist Detective": "人種差別の探偵",
  "Snail Eaters": "カタツムリを食べる人たち",
  "Memory of Miami Dolphins": "マイアミ・ドルフィンズの記憶",
  "Nice Tourist": "親切な観光客",
  "Alternate Weather": "別巡のウェザー"
};

let countName = 0;
let countStand = 0;

db.characters.forEach(char => {
  // Translate Stand
  if (char.details?.info?.ja?.Stand) {
    let s = char.details.info.ja.Stand;
    for (const [en, ja] of Object.entries(translations)) {
      if (s.includes(en)) {
        s = s.replace(new RegExp(en, 'g'), ja);
      }
    }
    // Also remove generic appended words like "(Temporarily)" or "Unnamed Stand"
    s = s.replace(/\(Temporarily\)/gi, '（一時的）')
         .replace(/Unnamed Stand/gi, '名称不明のスタンド')
         .replace(/Unnamed Stands/gi, '名称不明のスタンド')
         .replace(/Spoiler/g, '／')
         .replace(/Shared with Diavolo/gi, 'ディアボロと共有')
         .replace(/\(DISC\)/gi, '（DISC）')
         .replace(/\(Novel\)/gi, '（小説版）')
         .replace(/\(Postmortem\)/gi, '（死後）');
         
    if (s !== char.details.info.ja.Stand) {
      char.details.info.ja.Stand = s;
      countStand++;
    }
  }

  // Translate Name in ja if it is purely English
  if (/^[A-Za-z0-9\s\.\-']+$/.test(char.name.ja)) {
    const enName = char.name.ja;
    // Check specific translations
    if (translations[enName]) {
      char.name.ja = translations[enName];
      countName++;
    } else if (descriptiveTranslations[enName]) {
      char.name.ja = descriptiveTranslations[enName];
      countName++;
    } else {
      // For "...'s Something", try to translate piece by piece
      let newName = enName;
      if (newName.includes("'s")) {
        newName = newName.replace(/(.*)'s (.*)/, (match, p1, p2) => {
          let np1 = translations[p1] || p1;
          let np2 = descriptiveTranslations[p2] || p2;
          
          if(np1 === p1 && db.characters.find(c => c.name.en === p1)) {
            // Find canonical Japanese name for the possessor
            const c = db.characters.find(c => c.name.en === p1);
            if (c.details.info.en && c.details.info.en['Japanese Name']) {
               np1 = c.details.info.en['Japanese Name'];
            }
          }
          
          const translationsMap = {
            "Mother": "母", "Father": "父", "Sister": "妹/姉", "Brother": "弟/兄",
            "Friends": "友人たち", "Victim": "犠牲者", "Victims": "犠牲者たち",
            "Dog": "犬", "Girlfriend": "彼女", "Boyfriend": "彼氏", "Servants": "召使い",
            "Prisoners": "囚人たち", "Doctor": "医者", "Doctors": "医者たち",
            "Colleague": "同僚", "Groupies": "取り巻き"
          };
          if (translationsMap[p2]) np2 = translationsMap[p2];
          
          return np1 + "の" + np2;
        });
      }
      if (newName !== enName) {
        char.name.ja = newName;
        countName++;
      }
    }
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Updated ${countStand} Stand names and ${countName} Character names in Japanese.`);
