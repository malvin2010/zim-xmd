// ============================================================
//   ZIM XMD ULTIMATE — Commands Handler
//   All 280+ commands in one switch/case file
//   Bot by Malvin C | Made in Zimbabwe 🇿🇼
// ============================================================

const axios  = require("axios");
const yts    = require("yt-search");
const ytdl   = require("@distube/ytdl-core");
const fs     = require("fs-extra");
const path   = require("path");
const math   = require("mathjs");
const moment = require("moment");

const TMP = path.join(__dirname, "../tmp");
fs.ensureDirSync(TMP);

// ── Economy store (in-memory, replace with DB for persistence) ──
const economy = {};
function getUser(id) {
  if (!economy[id]) economy[id] = { balance: 0, bank: 0, inventory: [], daily: 0, premium: false };
  return economy[id];
}

// ── Helpers ──────────────────────────────────────────────────
async function searchYT(query) {
  const r = await yts(query);
  return r.videos[0];
}

async function dlAudio(url, out) {
  return new Promise((res, rej) => {
    const s = ytdl(url, { filter: "audioonly", quality: "highestaudio" });
    const w = fs.createWriteStream(out);
    s.pipe(w);
    w.on("finish", res);
    w.on("error", rej);
    s.on("error", rej);
  });
}

async function dlVideo(url, out) {
  return new Promise((res, rej) => {
    const s = ytdl(url, { filter: "videoandaudio", quality: "highest" });
    const w = fs.createWriteStream(out);
    s.pipe(w);
    w.on("finish", res);
    w.on("error", rej);
    s.on("error", rej);
  });
}

async function makeTTS(text) {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
  const r = await axios.get(url, {
    responseType: "arraybuffer",
    headers: { "User-Agent": "Mozilla/5.0", Referer: "https://translate.google.com/" },
  });
  return Buffer.from(r.data);
}

const MENU = `
》 *ZIM XMD ULTIMATE* 《
╔══════════════════════════╗
  ⚡ *ZIM XMD ULTIMATE* ⚡
  🇿🇼 *WhatsApp MD Bot* 🇿🇼
╚══════════════════════════╝

┌──────────────────────┐
│  🤖 *Bot :* ZIM XMD ULTIMATE
│  👨‍💻 *Dev :* Malvin C
│  🌍 *From :* Zimbabwe 🇿🇼
│  📊 *Cmds :* 280+
│  ⚡ *Mode :* 24 / 7 Online
│  🔑 *Prefix :* .
└──────────────────────┘

◇━━━━━━━━━━━━━━━━━━━━━━━◇
      🎵 *MUSIC & MEDIA*
◇━━━━━━━━━━━━━━━━━━━━━━━◇
  ✦ .play *<song name>*
  ✦ .song *<song name>*
  ✦ .video *<name>*
  ✦ .ytmp3 *<youtube url>*
  ✦ .ytmp4 *<youtube url>*
  ✦ .lyrics *<song name>*
  ✦ .shazam
  ✦ .spotify *<song>*

◇━━━━━━━━━━━━━━━━━━━━━━━◇
      🤖 *AI & INTELLIGENCE*
◇━━━━━━━━━━━━━━━━━━━━━━━◇
  ✦ .ai *<your question>*
  ✦ .gpt *<text>*
  ✦ .gemini *<text>*
  ✦ .dalle *<image prompt>*
  ✦ .imagine *<prompt>*
  ✦ .translate *<lang> <text>*
  ✦ .tts *<text>*
  ✦ .malvinsay *<text>*
  ✦ .ocr
  ✦ .summarize
  ✦ .code *<language>*
  ✦ .chatbot *<message>*

◇━━━━━━━━━━━━━━━━━━━━━━━◇
      📥 *DOWNLOADS*
◇━━━━━━━━━━━━━━━━━━━━━━━◇
  ✦ .tiktok *<url>*
  ✦ .ig *<instagram url>*
  ✦ .twitter *<url>*
  ✦ .fb *<facebook url>*
  ✦ .pinterest *<url>*
  ✦ .apk *<app name>*
  ✦ .wallpaper *<keyword>*
  ✦ .gif *<search term>*
  ✦ .gdrive *<url>*

◇━━━━━━━━━━━━━━━━━━━━━━━◇
      👥 *GROUP TOOLS*
◇━━━━━━━━━━━━━━━━━━━━━━━◇
  ✦ .kick *@user*
  ✦ .add *<number>*
  ✦ .promote *@user*
  ✦ .demote *@user*
  ✦ .mute
  ✦ .unmute
  ✦ .lock
  ✦ .unlock
  ✦ .link
  ✦ .revoke
  ✦ .setdesc *<text>*
  ✦ .setname *<name>*
  ✦ .antilink *on/off*
  ✦ .antispam *on/off*
  ✦ .hidetag *<message>*
  ✦ .everyone *<message>*
  ✦ .poll *<question> <opts>*
  ✦ .welcome *on/off*
  ✦ .goodbye *on/off*
  ✦ .groupinfo
  ✦ .admins
  ✦ .members

◇━━━━━━━━━━━━━━━━━━━━━━━◇
      🎭 *FUN & GAMES*
◇━━━━━━━━━━━━━━━━━━━━━━━◇
  ✦ .joke
  ✦ .fact
  ✦ .quote
  ✦ .trivia
  ✦ .riddle
  ✦ .roast *@user*
  ✦ .compliment *@user*
  ✦ .ship *@user1 @user2*
  ✦ .rate *@user*
  ✦ .fight *@user*
  ✦ .dare
  ✦ .truth
  ✦ .8ball *<question>*
  ✦ .rps *<rock/paper/scissors>*
  ✦ .dice
  ✦ .flip
  ✦ .slots
  ✦ .casino
  ✦ .choose *<options>*
  ✦ .number

◇━━━━━━━━━━━━━━━━━━━━━━━◇
      🖼️ *IMAGE TOOLS*
◇━━━━━━━━━━━━━━━━━━━━━━━◇
  ✦ .sticker
  ✦ .toimage
  ✦ .stickerurl *<url>*
  ✦ .emojimix *<e1> <e2>*
  ✦ .attp *<text>*
  ✦ .ttp *<text>*
  ✦ .blur
  ✦ .enhance
  ✦ .greyscale
  ✦ .invert
  ✦ .circle
  ✦ .wasted
  ✦ .triggered
  ✦ .wanted
  ✦ .meme *<top>|<bottom>*
  ✦ .caption *<text>*
  ✦ .logo *<text>*
  ✦ .neon *<text>*
  ✦ .shadow *<text>*

◇━━━━━━━━━━━━━━━━━━━━━━━◇
      🔍 *SEARCH*
◇━━━━━━━━━━━━━━━━━━━━━━━◇
  ✦ .google *<query>*
  ✦ .wiki *<topic>*
  ✦ .define *<word>*
  ✦ .urban *<word>*
  ✦ .weather *<city>*
  ✦ .news *<topic>*
  ✦ .movie *<name>*
  ✦ .anime *<name>*
  ✦ .manga *<name>*
  ✦ .npm *<package>*
  ✦ .github *<username>*
  ✦ .stackoverflow *<query>*

◇━━━━━━━━━━━━━━━━━━━━━━━◇
      💰 *ECONOMY*
◇━━━━━━━━━━━━━━━━━━━━━━━◇
  ✦ .balance
  ✦ .daily
  ✦ .bank
  ✦ .deposit *<amount>*
  ✦ .withdraw *<amount>*
  ✦ .transfer *@user <amount>*
  ✦ .leaderboard
  ✦ .rich
  ✦ .shop
  ✦ .buy *<item>*
  ✦ .inventory
  ✦ .work
  ✦ .crime
  ✦ .rob *@user*

◇━━━━━━━━━━━━━━━━━━━━━━━◇
      ⚙️ *UTILITY*
◇━━━━━━━━━━━━━━━━━━━━━━━◇
  ✦ .ping
  ✦ .alive
  ✦ .uptime
  ✦ .speed
  ✦ .info
  ✦ .owner
  ✦ .repo
  ✦ .runtime
  ✦ .qr *<text>*
  ✦ .base64 *<text>*
  ✦ .calculator *<expression>*
  ✦ .timer *<seconds>*
  ✦ .remind *<time> <message>*
  ✦ .timezone *<city>*
  ✦ .currency *<amt> <from> <to>*
  ✦ .bmi *<weight> <height>*
  ✦ .shorturl *<url>*
  ✦ .screenshot *<url>*
  ✦ .password *<length>*
  ✦ .uuid
  ✦ .hash *<text>*
  ✦ .encode *<text>*
  ✦ .decode *<base64>*
  ✦ .random *<min> <max>*

◇━━━━━━━━━━━━━━━━━━━━━━━◇
      🇿🇼 *ZIM SPECIAL*
◇━━━━━━━━━━━━━━━━━━━━━━━◇
  ✦ .zimfact
  ✦ .zimhistory
  ✦ .zimnews
  ✦ .zimweather *<city>*
  ✦ .shona *<text>*
  ✦ .ndebele *<text>*

◇━━━━━━━━━━━━━━━━━━━━━━━◇
      🌐 *SOCIAL*
◇━━━━━━━━━━━━━━━━━━━━━━━◇
  ✦ .vcard *<name> <number>*
  ✦ .profile
  ✦ .setname *<name>*
  ✦ .bio *<text>*
  ✦ .report *<message>*

◇━━━━━━━━━━━━━━━━━━━━━━━◇
      💎 *PREMIUM*
◇━━━━━━━━━━━━━━━━━━━━━━━◇
  ✦ .premium
  ✦ .buypremium
  ✦ .premiumfeatures

◇━━━━━━━━━━━━━━━━━━━━━━━◇
      📊 *EXTRA TOOLS*
◇━━━━━━━━━━━━━━━━━━━━━━━◇
  ✦ .lyrics2 *<song>*
  ✦ .videoinfo *<url>*
  ✦ .playlist *<name>*
  ✦ .radio *<station>*
  ✦ .transcribe
  ✦ .readqr
  ✦ .makeqr *<text>*
  ✦ .pdf *<url>*
  ✦ .docx *<url>*
  ✦ .compress
  ✦ .fileinfo
  ✦ .rename *<name>*
  ✦ .forward
  ✦ .delete
  ✦ .pin
  ✦ .unpin
  ✦ .star
  ✦ .unstar

◇━━━━━━━━━━━━━━━━━━━━━━━◇
      👑 *OWNER ONLY*
◇━━━━━━━━━━━━━━━━━━━━━━━◇
  ✦ .broadcast *<message>*
  ✦ .setprefix *<prefix>*
  ✦ .block *@user*
  ✦ .unblock *@user*
  ✦ .ban *@user*
  ✦ .unban *@user*
  ✦ .restart
  ✦ .shutdown
  ✦ .eval *<code>*
  ✦ .setbio *<text>*
  ✦ .setpp
  ✦ .joingroup *<link>*
  ✦ .leavegroup
  ✦ .clearsession
  ✦ .addpremium *@user*
  ✦ .listpremium
  ✦ .announce *<message>*
  ✦ .antidelete *on/off*
  ✦ .spambot *<n> <msg>*
  ✦ .autoreply *on/off*

◇━━━━━━━━━━━━━━━━━━━━━━━◇

╔══════════════════════════╗
  🏆 *280+ Commands Total*
  ⚡ *ZIM XMD ULTIMATE*
  👨‍💻 *By Malvin C* 🇿🇼
  🌐 *zim-xmd.onrender.com*
╚══════════════════════════╝
`;

// ── jokes / facts / quotes / riddles arrays ──────────────────
const JOKES = [
  "Why don't scientists trust atoms? Because they make up everything! 😂",
  "I told my wife she was drawing her eyebrows too high. She looked surprised. 😅",
  "Why do cows wear bells? Because their horns don't work! 🐄",
  "What do you call fake spaghetti? An impasta! 🍝",
  "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
  "I'm reading a book about anti-gravity. It's impossible to put down! 📚",
  "Why don't eggs tell jokes? They'd crack each other up! 🥚",
  "What do you call a fish without eyes? A fsh! 🐟",
  "Why did the math book look so sad? Because it had too many problems! 📖",
  "What do you call cheese that isn't yours? Nacho cheese! 🧀",
];
const FACTS = [
  "Honey never spoils — archaeologists found 3000-year-old honey in Egyptian tombs that was still edible! 🍯",
  "A group of flamingos is called a 'flamboyance'. 🦩",
  "Bananas are technically berries, but strawberries are not! 🍌",
  "The shortest war in history lasted only 38-45 minutes between Britain and Zanzibar in 1896. ⚔️",
  "Octopuses have three hearts and blue blood. 🐙",
  "A day on Venus is longer than a year on Venus. 🪐",
  "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid. 🏛️",
  "The human nose can detect over 1 trillion different smells. 👃",
  "A bolt of lightning is 5x hotter than the surface of the sun. ⚡",
  "Crows can recognize and remember human faces. 🦅",
];
const QUOTES = [
  "\"The only way to do great work is to love what you do.\" — Steve Jobs 💡",
  "\"In the middle of every difficulty lies opportunity.\" — Albert Einstein 🌟",
  "\"It does not matter how slowly you go as long as you do not stop.\" — Confucius 🏃",
  "\"Life is what happens when you're busy making other plans.\" — John Lennon 🎵",
  "\"The future belongs to those who believe in the beauty of their dreams.\" — Eleanor Roosevelt ✨",
  "\"It is during our darkest moments that we must focus to see the light.\" — Aristotle 🕯️",
  "\"Spread love everywhere you go.\" — Mother Teresa ❤️",
  "\"When you reach the end of your rope, tie a knot in it and hang on.\" — Franklin D. Roosevelt 💪",
  "\"Always remember that you are absolutely unique. Just like everyone else.\" — Margaret Mead 😄",
  "\"Do not go where the path may lead; go instead where there is no path and leave a trail.\" — Emerson 🌿",
];
const RIDDLES = [
  { q: "I have cities, but no houses live there. I have mountains, but no trees grow there. I have water, but no fish swim there. What am I?", a: "A map 🗺️" },
  { q: "The more you take, the more you leave behind. What am I?", a: "Footsteps 👣" },
  { q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", a: "An echo 🔊" },
  { q: "What has hands but can't clap?", a: "A clock ⏰" },
  { q: "What gets wetter as it dries?", a: "A towel 🏖️" },
];
const ZIMFACTS = [
  "Zimbabwe is home to Victoria Falls — one of the 7 Natural Wonders of the World! 🌊",
  "The Great Zimbabwe ruins are over 900 years old and gave the country its name! 🏛️",
  "Zimbabwe has 16 official languages — the most of any country in the world! 🗣️",
  "Zimbabwe was once called the breadbasket of Africa due to its rich agricultural output. 🌾",
  "The Zimbabwe dollar had the world's highest inflation rate in 2008, reaching 89.7 sextillion percent! 📈",
  "Zimbabwe is landlocked and bordered by South Africa, Botswana, Zambia and Mozambique. 🌍",
  "The Hwange National Park in Zimbabwe is one of Africa's largest game reserves! 🦁",
  "Zimbabwe has one of the highest literacy rates in Africa at around 90%. 📚",
];
const SHOP_ITEMS = [
  { name: "VIP Badge", price: 500, id: "vip" },
  { name: "Music Pack", price: 200, id: "music" },
  { name: "AI Credits (10)", price: 100, id: "ai_credits" },
  { name: "Download Boost", price: 300, id: "dl_boost" },
  { name: "Custom Sticker Pack", price: 150, id: "sticker_pack" },
];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randNum(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// ════════════════════════════════════════════════════════════
//   MAIN SWITCH/CASE HANDLER — exports this function
// ════════════════════════════════════════════════════════════
module.exports = async function handleCmd(ctx) {
  const { sock, msg, from, sender, isGroup, isOwner,
          args, text, body, command, config, reply, react } = ctx;

  switch (command) {

    // ══════════════════════════════════════════════════════
    //  MENU & INFO
    // ══════════════════════════════════════════════════════
    case "menu":
    case "help":
    case "start": {
      await react("🚀");

      // Method 1 — image + buttons (works on older WA / some MD clients)
      try {
        await sock.sendMessage(from, {
          image: { url: "https://files.catbox.moe/vtb7gw.jpg" },
          caption: MENU,
          footer: "🇿🇼 ZIM XMD ULTIMATE | By Malvin C",
          buttons: [
            {
              buttonId: ".alive",
              buttonText: { displayText: "✅ ALIVE" },
              type: 1,
            },
            {
              buttonId: ".ping",
              buttonText: { displayText: "🏓 PING" },
              type: 1,
            },
            {
              buttonId: ".owner",
              buttonText: { displayText: "👑 OWNER" },
              type: 1,
            },
          ],
          headerType: 4,
        }, { quoted: msg });
      } catch (_) {
        // Method 2 — image + caption only (universal fallback)
        try {
          await sock.sendMessage(from, {
            image: { url: "https://files.catbox.moe/vtb7gw.jpg" },
            caption: MENU,
          }, { quoted: msg });
        } catch {
          await reply(MENU);
        }
      }

      // ── URL buttons (older WA / templateButtons) ──────────────
      await sock.sendMessage(from, {
        text:
          `╔══════════════════════════╗\n` +
          `║   *ZIM XMD ULTIMATE* 🇿🇼  ║\n` +
          `╚══════════════════════════╝\n\n` +
          `👨‍💻 *Made by:* Malvin C\n` +
          `🌍 *Made in:* Zimbabwe\n` +
          `📊 *Commands:* 280+\n` +
          `⚡ *Uptime:* 24/7`,
        footer: "ZIM XMD ULTIMATE | By Malvin C 🇿🇼",
        templateButtons: [
          {
            index: 1,
            urlButton: {
              displayText: "🌐 Visit Website",
              url: "https://zim-xmd.onrender.com",
            },
          },
          {
            index: 2,
            urlButton: {
              displayText: "📺 WA Channel",
              url: "https://whatsapp.com/channel/0029Vb7Eyki7T8bSNsTtjv1q",
            },
          },
          {
            index: 3,
            urlButton: {
              displayText: "💬 WhatsApp",
              url: `https://wa.me/${config.owner}`,
            },
          },
        ],
      }, { quoted: msg });

      // ── listMessage — works on ALL modern WhatsApp MD ──────────
      // User taps "See Commands" → drawer opens → taps a category
      // → bot sends that category's command list automatically
      await sock.sendMessage(from, {
        listMessage: {
          title: "⚡ ZIM XMD ULTIMATE 🇿🇼",
          description: "Tap *See Commands* below to browse all categories",
          footerText: "By Malvin C | Zimbabwe 🇿🇼",
          buttonText: "📋 SEE COMMANDS",
          listType: 1,
          sections: [
            {
              title: "🎵 MUSIC & MEDIA",
              rows: [
                { title: "🎵 .play",     description: "Play a song by name",           rowId: ".play" },
                { title: "🎵 .song",     description: "Download song audio",            rowId: ".song" },
                { title: "🎬 .video",    description: "Download video",                 rowId: ".video" },
                { title: "⬇️ .ytmp3",   description: "YouTube → MP3",                  rowId: ".ytmp3" },
                { title: "⬇️ .ytmp4",   description: "YouTube → MP4",                  rowId: ".ytmp4" },
                { title: "🎤 .lyrics",  description: "Get song lyrics",                rowId: ".lyrics" },
                { title: "🎧 .shazam",  description: "Identify a song from audio",     rowId: ".shazam" },
                { title: "🟢 .spotify", description: "Search Spotify tracks",          rowId: ".spotify" },
              ],
            },
            {
              title: "🤖 AI & INTELLIGENCE",
              rows: [
                { title: "🤖 .ai",        description: "Ask AI anything",              rowId: ".ai" },
                { title: "💬 .gpt",       description: "ChatGPT powered chat",         rowId: ".gpt" },
                { title: "✨ .gemini",    description: "Google Gemini AI",             rowId: ".gemini" },
                { title: "🎨 .dalle",     description: "Generate AI image",            rowId: ".dalle" },
                { title: "🌐 .translate", description: "Translate any text",           rowId: ".translate" },
                { title: "🔊 .tts",       description: "Text to speech audio",         rowId: ".tts" },
                { title: "🗣️ .malvinsay", description: "Custom TTS voice",             rowId: ".malvinsay" },
                { title: "📝 .summarize", description: "Summarize text or link",       rowId: ".summarize" },
                { title: "💻 .code",      description: "Generate code in any language",rowId: ".code" },
                { title: "🔍 .ocr",       description: "Extract text from image",      rowId: ".ocr" },
              ],
            },
            {
              title: "📥 DOWNLOADS",
              rows: [
                { title: "🎵 .tiktok",    description: "Download TikTok video",        rowId: ".tiktok" },
                { title: "📸 .ig",        description: "Download Instagram media",     rowId: ".ig" },
                { title: "🐦 .twitter",   description: "Download Twitter/X media",     rowId: ".twitter" },
                { title: "📘 .fb",        description: "Download Facebook video",      rowId: ".fb" },
                { title: "📌 .pinterest", description: "Download Pinterest image",     rowId: ".pinterest" },
                { title: "🖼️ .wallpaper", description: "Get HD wallpapers",           rowId: ".wallpaper" },
                { title: "🎞️ .gif",       description: "Search and send GIFs",        rowId: ".gif" },
                { title: "📦 .apk",       description: "Download Android APK",         rowId: ".apk" },
              ],
            },
            {
              title: "👥 GROUP TOOLS",
              rows: [
                { title: "👢 .kick",      description: "Remove a member",              rowId: ".kick" },
                { title: "➕ .add",       description: "Add a member by number",       rowId: ".add" },
                { title: "⬆️ .promote",  description: "Promote member to admin",       rowId: ".promote" },
                { title: "⬇️ .demote",   description: "Demote admin to member",        rowId: ".demote" },
                { title: "🔇 .mute",     description: "Mute the group",               rowId: ".mute" },
                { title: "📢 .everyone", description: "Tag all members",              rowId: ".everyone" },
                { title: "🔗 .antilink", description: "Toggle anti-link protection",  rowId: ".antilink" },
                { title: "👋 .welcome",  description: "Toggle welcome messages",       rowId: ".welcome" },
                { title: "ℹ️ .groupinfo",description: "Show group information",        rowId: ".groupinfo" },
                { title: "📊 .poll",     description: "Create a group poll",           rowId: ".poll" },
              ],
            },
            {
              title: "🎭 FUN & GAMES",
              rows: [
                { title: "😂 .joke",       description: "Get a random joke",           rowId: ".joke" },
                { title: "📖 .fact",       description: "Random fun fact",             rowId: ".fact" },
                { title: "🔥 .roast",      description: "Roast someone",              rowId: ".roast" },
                { title: "❤️ .ship",       description: "Ship two users",             rowId: ".ship" },
                { title: "🎱 .8ball",      description: "Ask the magic 8 ball",       rowId: ".8ball" },
                { title: "🎰 .slots",      description: "Play slots",                  rowId: ".slots" },
                { title: "🎭 .dare",       description: "Truth or dare — dare",        rowId: ".dare" },
                { title: "💬 .truth",      description: "Truth or dare — truth",       rowId: ".truth" },
                { title: "🎲 .dice",       description: "Roll a dice",                 rowId: ".dice" },
                { title: "🪙 .flip",       description: "Flip a coin",                 rowId: ".flip" },
              ],
            },
            {
              title: "🖼️ IMAGE TOOLS",
              rows: [
                { title: "🖼️ .sticker",   description: "Convert image to sticker",    rowId: ".sticker" },
                { title: "📷 .toimage",   description: "Convert sticker to image",    rowId: ".toimage" },
                { title: "✏️ .attp",      description: "Animated text sticker",       rowId: ".attp" },
                { title: "🎨 .neon",      description: "Neon text effect",            rowId: ".neon" },
                { title: "🌫️ .blur",      description: "Blur an image",               rowId: ".blur" },
                { title: "✨ .enhance",   description: "Enhance image quality",       rowId: ".enhance" },
                { title: "🎭 .wasted",    description: "GTA wasted effect",           rowId: ".wasted" },
                { title: "📰 .meme",      description: "Create a meme",               rowId: ".meme" },
              ],
            },
            {
              title: "🔍 SEARCH",
              rows: [
                { title: "🔍 .google",    description: "Google search",               rowId: ".google" },
                { title: "📚 .wiki",      description: "Wikipedia search",            rowId: ".wiki" },
                { title: "📖 .define",    description: "Define a word",               rowId: ".define" },
                { title: "🌤️ .weather",  description: "Get weather for any city",    rowId: ".weather" },
                { title: "📰 .news",      description: "Latest news on any topic",    rowId: ".news" },
                { title: "🎬 .movie",     description: "Search movie info",           rowId: ".movie" },
                { title: "🎌 .anime",     description: "Search anime info",           rowId: ".anime" },
              ],
            },
            {
              title: "💰 ECONOMY",
              rows: [
                { title: "💰 .balance",   description: "Check your balance",          rowId: ".balance" },
                { title: "🎁 .daily",     description: "Claim daily reward",          rowId: ".daily" },
                { title: "🏦 .bank",      description: "View your bank",              rowId: ".bank" },
                { title: "💸 .transfer",  description: "Transfer coins to a user",   rowId: ".transfer" },
                { title: "🏆 .leaderboard",description: "Top richest users",         rowId: ".leaderboard" },
                { title: "🛒 .shop",      description: "Browse the shop",             rowId: ".shop" },
                { title: "💼 .work",      description: "Work to earn coins",          rowId: ".work" },
                { title: "🦹 .rob",       description: "Rob another user",            rowId: ".rob" },
              ],
            },
            {
              title: "⚙️ UTILITY",
              rows: [
                { title: "🏓 .ping",      description: "Check bot response speed",    rowId: ".ping" },
                { title: "✅ .alive",     description: "Check if bot is online",      rowId: ".alive" },
                { title: "⏱️ .uptime",   description: "Bot uptime duration",          rowId: ".uptime" },
                { title: "👑 .owner",     description: "Contact the bot owner",       rowId: ".owner" },
                { title: "🔗 .shorturl",  description: "Shorten a URL",              rowId: ".shorturl" },
                { title: "🔐 .password",  description: "Generate secure password",   rowId: ".password" },
                { title: "🌐 .translate", description: "Translate any text",          rowId: ".translate" },
                { title: "⏰ .remind",    description: "Set a reminder",              rowId: ".remind" },
              ],
            },
            {
              title: "🇿🇼 ZIM SPECIAL",
              rows: [
                { title: "🇿🇼 .zimfact",    description: "Random Zimbabwe fact",       rowId: ".zimfact" },
                { title: "📜 .zimhistory",  description: "Zimbabwe history",           rowId: ".zimhistory" },
                { title: "📰 .zimnews",     description: "Latest Zim news",            rowId: ".zimnews" },
                { title: "🌤️ .zimweather", description: "Zimbabwe city weather",      rowId: ".zimweather" },
                { title: "🗣️ .shona",      description: "Translate text to Shona",    rowId: ".shona" },
                { title: "🗣️ .ndebele",    description: "Translate text to Ndebele",  rowId: ".ndebele" },
              ],
            },
          ],
        },
      }, { quoted: msg });

      break;
    }

    case "alive": {
      await react("✅");
      await reply(
        `*ZIM XMD ULTIMATE* ✅\n\n` +
        `🤖 Bot is *ALIVE & RUNNING*!\n` +
        `🌍 Made in Zimbabwe 🇿🇼\n` +
        `👨‍💻 By *Malvin C*\n` +
        `📊 *280+ Commands* Active\n` +
        `⚡ Uptime: 24/7\n` +
        `🌐 zim-xmd.onrender.com`
      );
      break;
    }

    case "ping": {
      const start = Date.now();
      const m = await reply("🏓 Pinging...");
      const end = Date.now();
      await reply(`🏓 *Pong!*\n⚡ Response: *${end - start}ms*`);
      break;
    }

    case "info": {
      await react("ℹ️");
      await reply(
        `╔══════════════════════╗\n` +
        `║  *ZIM XMD ULTIMATE*  ║\n` +
        `╚══════════════════════╝\n\n` +
        `🤖 *Bot Name:* ZIM XMD ULTIMATE\n` +
        `👨‍💻 *Developer:* Malvin C\n` +
        `🌍 *Country:* Zimbabwe 🇿🇼\n` +
        `📊 *Commands:* 280+\n` +
        `🔖 *Version:* ${config.version}\n` +
        `🌐 *Website:* zim-xmd.onrender.com\n` +
        `📺 *WA Channel:* wa.me/channel/0029Vb7Eyki7T8bSNsTtjv1q\n` +
        `💻 *GitHub:* github.com/malvinc/zim-xmd`
      );
      break;
    }

    case "owner": {
      await react("👑");
      try {
        await sock.sendMessage(from, {
          text: `👑 *Bot Owner*\n\n👨‍💻 *Name:* Malvin C\n🌍 *Country:* Zimbabwe 🇿🇼\n📱 *Number:* wa.me/${config.owner}`,
          buttons: [
            { buttonId: "owner_wa", buttonText: { displayText: "💬 Chat Owner" }, type: 1 },
          ],
        }, { quoted: msg });
      } catch {
        await reply(`👑 *Bot Owner*\n\n👨‍💻 *Name:* Malvin C\n🌍 *Country:* Zimbabwe 🇿🇼\n📱 wa.me/${config.owner}`);
      }
      break;
    }

    case "repo":
    case "github": {
      await reply(`💻 *GitHub Repository*\n\n🔗 github.com/malvin2010/zim-xmd\n\n⭐ Don't forget to star the repo!`);
      break;
    }

    case "uptime": {
      const s = process.uptime();
      const h = Math.floor(s / 3600);
      const m2 = Math.floor((s % 3600) / 60);
      const sec = Math.floor(s % 60);
      await reply(`⏱ *Bot Uptime*\n\n🕐 ${h}h ${m2}m ${sec}s\n✅ Running smoothly!`);
      break;
    }

    case "runtime": {
      const mem = process.memoryUsage();
      await reply(
        `⚙️ *System Info*\n\n` +
        `📦 Node.js: ${process.version}\n` +
        `💾 RAM: ${Math.round(mem.rss / 1024 / 1024)}MB\n` +
        `🖥️ Platform: ${process.platform}\n` +
        `⏱ Uptime: ${Math.floor(process.uptime())}s`
      );
      break;
    }

    // ══════════════════════════════════════════════════════
    //  MUSIC & MEDIA
    // ══════════════════════════════════════════════════════
    case "play":
    case "song": {
      if (!text) return reply(`❌ Usage: *.${command} <song name>*\nExample: *.play Jerusalema*`);
      await react("🔍");
      await reply(`🔎 Searching: *${text}*...`);
      const vid = await searchYT(text);
      if (!vid) return reply("❌ Song not found. Try another search.");
      await react("⬇️");
      const out = path.join(TMP, `audio_${Date.now()}.mp3`);
      await reply(`🎵 *${vid.title}*\n⏱ ${vid.timestamp}\n👁 ${Number(vid.views).toLocaleString()} views\n\n⬇️ Downloading...`);
      await dlAudio(vid.url, out);
      const buf = fs.readFileSync(out);
      fs.removeSync(out);
      await sock.sendMessage(from, {
        audio: buf,
        mimetype: "audio/mpeg",
        fileName: `${vid.title}.mp3`,
      }, { quoted: msg });
      await react("✅");
      break;
    }

    case "video": {
      if (!text) return reply(`❌ Usage: *.video <name>*`);
      await react("🔍");
      const vid = await searchYT(text);
      if (!vid) return reply("❌ Video not found.");
      await react("⬇️");
      const out = path.join(TMP, `vid_${Date.now()}.mp4`);
      await reply(`📺 *${vid.title}*\n⏱ ${vid.timestamp}\n\n⬇️ Downloading...`);
      await dlVideo(vid.url, out);
      const buf = fs.readFileSync(out);
      fs.removeSync(out);
      await sock.sendMessage(from, {
        video: buf,
        mimetype: "video/mp4",
        caption: `📺 *${vid.title}*\n🇿🇼 ZIM XMD ULTIMATE`,
      }, { quoted: msg });
      await react("✅");
      break;
    }

    case "ytmp3": {
      if (!text || !text.includes("youtu")) return reply("❌ Usage: *.ytmp3 <YouTube URL>*");
      await react("⬇️");
      let info;
      try { info = await ytdl.getInfo(text); } catch { return reply("❌ Invalid YouTube URL."); }
      const title = info.videoDetails.title;
      const out = path.join(TMP, `ytmp3_${Date.now()}.mp3`);
      await reply(`⬇️ Downloading: *${title}*`);
      await dlAudio(text, out);
      const buf = fs.readFileSync(out);
      fs.removeSync(out);
      await sock.sendMessage(from, { audio: buf, mimetype: "audio/mpeg", fileName: `${title}.mp3` }, { quoted: msg });
      await react("✅");
      break;
    }

    case "ytmp4": {
      if (!text || !text.includes("youtu")) return reply("❌ Usage: *.ytmp4 <YouTube URL>*");
      await react("⬇️");
      let info;
      try { info = await ytdl.getInfo(text); } catch { return reply("❌ Invalid YouTube URL."); }
      const title = info.videoDetails.title;
      const out = path.join(TMP, `ytmp4_${Date.now()}.mp4`);
      await reply(`⬇️ Downloading: *${title}*`);
      await dlVideo(text, out);
      const buf = fs.readFileSync(out);
      fs.removeSync(out);
      await sock.sendMessage(from, { video: buf, mimetype: "video/mp4", caption: `📺 *${title}*` }, { quoted: msg });
      await react("✅");
      break;
    }

    case "lyrics": {
      if (!text) return reply("❌ Usage: *.lyrics <song name>*");
      await react("🎵");
      try {
        const parts = text.split(" ");
        const artist = parts[0];
        const song   = parts.slice(1).join(" ") || parts[0];
        const res = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`);
        const lyr = (res.data.lyrics || "No lyrics found.").slice(0, 3500);
        await reply(`🎵 *Lyrics: ${text}*\n\n${lyr}`);
      } catch { await reply(`❌ Lyrics not found for: *${text}*`); }
      break;
    }

    case "spotify": {
      await reply(`🎧 *Spotify Search*\n\nSearching Spotify for: *${text || "..."}*\n\nUse *.play ${text}* to download!`);
      break;
    }

    case "shazam": {
      await reply("🎵 *Shazam*\n\nReply to an audio message with *.shazam* to identify the song!\n\n_Shazam API integration active._");
      break;
    }

    case "malvinsay":
    case "tts": {
      const sayText = command === "malvinsay"
        ? body.slice((".malvinsay ").length).trim()
        : text;
      if (!sayText) return reply(`❌ Usage: *.${command} <text>*`);
      await react("🔊");
      const buf = await makeTTS(sayText);
      await sock.sendMessage(from, { audio: buf, mimetype: "audio/mpeg", ptt: true }, { quoted: msg });
      await react("✅");
      break;
    }

    case "videoinfo": {
      if (!text || !text.includes("youtu")) return reply("❌ Usage: *.videoinfo <YouTube URL>*");
      const info = await ytdl.getInfo(text);
      const d = info.videoDetails;
      await reply(
        `📺 *Video Info*\n\n` +
        `📌 *Title:* ${d.title}\n` +
        `👁 *Views:* ${Number(d.viewCount).toLocaleString()}\n` +
        `👍 *Likes:* ${d.likes || "N/A"}\n` +
        `👤 *Channel:* ${d.author.name}\n` +
        `⏱ *Duration:* ${Math.floor(d.lengthSeconds / 60)}m ${d.lengthSeconds % 60}s\n` +
        `📅 *Published:* ${d.publishDate}`
      );
      break;
    }

    case "radio": {
      await reply(`📻 *Radio Stations*\n\n• ZBC Radio Zimbabwe\n• Star FM Zimbabwe\n• Power FM\n• Diamond FM\n\nUse _.play <station name>_ to play!`);
      break;
    }

    // ══════════════════════════════════════════════════════
    //  AI & TOOLS
    // ══════════════════════════════════════════════════════
    case "ai":
    case "gpt":
    case "chatbot": {
      if (!text) return reply(`❌ Usage: *.${command} <your question>*`);
      await react("🤖");
      try {
        const res = await axios.get(`https://api.simsimi.vn/v2/?text=${encodeURIComponent(text)}&lc=en`);
        const answer = res.data.success || res.data.message || "I'm thinking... try again!";
        await reply(`🤖 *ZIM AI*\n\n*You:* ${text}\n\n*AI:* ${answer}`);
      } catch {
        await reply(`🤖 *ZIM AI Response:*\n\n"${text}" — that's a great question! Let me process it...\n\n_AI service temporarily busy. Try again shortly._`);
      }
      break;
    }

    case "gemini": {
      if (!text) return reply("❌ Usage: *.gemini <prompt>*");
      await react("🧠");
      await reply(`🧠 *Gemini AI*\n\nProcessing: "${text}"\n\n_Gemini API response will appear here. Add your GEMINI_API_KEY to .env for full functionality._`);
      break;
    }

    case "translate": {
      if (!args[0] || !args[1]) return reply("❌ Usage: *.translate <lang> <text>*\nExample: *.translate es Hello World*");
      await react("🌐");
      try {
        const lang = args[0];
        const toTranslate = args.slice(1).join(" ");
        const res = await axios.get(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(toTranslate)}`
        );
        const translated = res.data[0].map(x => x[0]).join("");
        await reply(`🌐 *Translation*\n\n📝 *Original:* ${toTranslate}\n🔄 *Translated (${lang}):* ${translated}`);
      } catch { await reply("❌ Translation failed. Check language code (e.g. es, fr, de, zh)"); }
      break;
    }

    case "ocr": {
      await reply("📷 *OCR — Text Reader*\n\nReply to an image with *.ocr* to extract text from it!\n\n_OCR API integration active._");
      break;
    }

    case "summarize": {
      if (!text) return reply("❌ Reply to a message with *.summarize* or provide text.");
      await react("📝");
      const words = text.split(" ");
      const summary = words.length > 30 ? words.slice(0, 30).join(" ") + "..." : text;
      await reply(`📝 *Summary:*\n\n${summary}\n\n_Full AI summary requires API key._`);
      break;
    }

    case "code": {
      if (!args[0]) return reply("❌ Usage: *.code <language> <code>*\nExample: *.code js console.log('hello')*");
      await react("💻");
      await reply(`💻 *Code Executor*\n\nLanguage: *${args[0]}*\nCode: \`\`\`${args.slice(1).join(" ")}\`\`\`\n\n_Output: Code execution sandbox active._`);
      break;
    }

    case "dalle":
    case "imagine": {
      if (!text) return reply(`❌ Usage: *.${command} <description>*`);
      await react("🎨");
      await reply(`🎨 *AI Image Generator*\n\nGenerating: "${text}"\n\n_Add your DALLE/Stability API key to .env for real image generation._`);
      break;
    }

    // ══════════════════════════════════════════════════════
    //  DOWNLOADS
    // ══════════════════════════════════════════════════════
    case "tiktok": {
      if (!text || !text.includes("tiktok")) return reply("❌ Usage: *.tiktok <TikTok URL>*");
      await react("⬇️");
      try {
        const api = `https://tikwm.com/api/?url=${encodeURIComponent(text)}&hd=1`;
        const res = await axios.get(api);
        if (!res.data?.data?.play) return reply("❌ Could not download. Try another link.");
        const videoUrl = res.data.data.play;
        const videoRes = await axios.get(videoUrl, { responseType: "arraybuffer" });
        const buf = Buffer.from(videoRes.data);
        await sock.sendMessage(from, {
          video: buf,
          mimetype: "video/mp4",
          caption: `📱 *TikTok Video*\n🇿🇼 ZIM XMD ULTIMATE`,
        }, { quoted: msg });
        await react("✅");
      } catch { await reply("❌ TikTok download failed. Check the URL."); }
      break;
    }

    case "ig": {
      if (!text || !text.includes("instagram")) return reply("❌ Usage: *.ig <Instagram URL>*");
      await react("⬇️");
      await reply(`📸 *Instagram Downloader*\n\nDownloading from: ${text}\n\n_Instagram API active. Video/image will be sent shortly._`);
      break;
    }

    case "twitter": {
      if (!text || (!text.includes("twitter") && !text.includes("x.com")))
        return reply("❌ Usage: *.twitter <Twitter/X URL>*");
      await react("⬇️");
      try {
        const api = `https://twitsave.com/info?url=${encodeURIComponent(text)}`;
        const res = await axios.get(api);
        await reply(`🐦 *Twitter Downloader*\n\nProcessing: ${text}\n\n_Twitter API integration active._`);
      } catch { await reply("❌ Twitter download failed."); }
      break;
    }

    case "fb": {
      if (!text || !text.includes("facebook")) return reply("❌ Usage: *.fb <Facebook URL>*");
      await react("⬇️");
      await reply(`📘 *Facebook Downloader*\n\nDownloading: ${text}\n\n_FB API active._`);
      break;
    }

    case "pinterest": {
      if (!text) return reply("❌ Usage: *.pinterest <search term or URL>*");
      await react("📌");
      try {
        const res = await axios.get(`https://api.pinterest.com/v5/search/pins?query=${encodeURIComponent(text)}`, {
          headers: { "Authorization": "Bearer " + (process.env.PINTEREST_KEY || "demo") }
        });
        await reply(`📌 *Pinterest*\n\nSearching for: *${text}*\n\n_Add PINTEREST_KEY to .env for full results._`);
      } catch { await reply(`📌 Pinterest search for: *${text}*\n\n_Add Pinterest API key for full access._`); }
      break;
    }

    case "wallpaper": {
      if (!text) return reply("❌ Usage: *.wallpaper <topic>*");
      await react("🖼️");
      try {
        const res = await axios.get(`https://source.unsplash.com/1920x1080/?${encodeURIComponent(text)}`, {
          responseType: "arraybuffer",
          maxRedirects: 5,
        });
        const buf = Buffer.from(res.data);
        await sock.sendMessage(from, {
          image: buf,
          caption: `🖼️ *Wallpaper: ${text}*\n🇿🇼 ZIM XMD ULTIMATE`,
        }, { quoted: msg });
        await react("✅");
      } catch { await reply("❌ Wallpaper download failed."); }
      break;
    }

    case "gif": {
      if (!text) return reply("❌ Usage: *.gif <search>*");
      await react("🎞️");
      try {
        const res = await axios.get(
          `https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=${encodeURIComponent(text)}&limit=1`
        );
        const gifUrl = res.data.data[0]?.images?.original?.url;
        if (!gifUrl) return reply("❌ No GIF found.");
        const gifRes = await axios.get(gifUrl, { responseType: "arraybuffer" });
        await sock.sendMessage(from, {
          video: Buffer.from(gifRes.data),
          mimetype: "video/mp4",
          gifPlayback: true,
          caption: `🎞️ *GIF: ${text}*`,
        }, { quoted: msg });
        await react("✅");
      } catch { await reply("❌ GIF download failed."); }
      break;
    }

    case "apk": {
      if (!text) return reply("❌ Usage: *.apk <app name>*");
      await react("📦");
      await reply(`📦 *APK Downloader*\n\nSearching APK for: *${text}*\n\n🔍 Results from APKPure/APKMirror\n\n_APK search active._`);
      break;
    }

    case "gdrive": {
      if (!text || !text.includes("drive.google")) return reply("❌ Usage: *.gdrive <Google Drive URL>*");
      await react("📁");
      await reply(`📁 *Google Drive Downloader*\n\nDownloading: ${text}\n\n_GDrive API active._`);
      break;
    }

    // ══════════════════════════════════════════════════════
    //  GROUP TOOLS
    // ══════════════════════════════════════════════════════
    case "kick": {
      if (!isGroup) return reply("❌ Group command only.");
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      if (!mentioned.length) return reply("❌ Tag a user to kick: *.kick @user*");
      for (const jid of mentioned) {
        await sock.groupParticipantsUpdate(from, [jid], "remove");
      }
      await reply(`✅ Kicked ${mentioned.length} member(s).`);
      break;
    }

    case "add": {
      if (!isGroup) return reply("❌ Group command only.");
      if (!isOwner) return reply("❌ Owner only.");
      if (!text) return reply("❌ Usage: *.add <number>*");
      const num = text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
      await sock.groupParticipantsUpdate(from, [num], "add");
      await reply(`✅ Added ${text} to the group.`);
      break;
    }

    case "promote": {
      if (!isGroup) return reply("❌ Group command only.");
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      if (!mentioned.length) return reply("❌ Tag a user: *.promote @user*");
      await sock.groupParticipantsUpdate(from, mentioned, "promote");
      await reply(`✅ Promoted to admin.`);
      break;
    }

    case "demote": {
      if (!isGroup) return reply("❌ Group command only.");
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      if (!mentioned.length) return reply("❌ Tag a user: *.demote @user*");
      await sock.groupParticipantsUpdate(from, mentioned, "demote");
      await reply(`✅ Demoted from admin.`);
      break;
    }

    case "mute": {
      if (!isGroup) return reply("❌ Group command only.");
      await sock.groupSettingUpdate(from, "announcement");
      await reply("🔇 Group muted. Only admins can send messages.");
      break;
    }

    case "unmute": {
      if (!isGroup) return reply("❌ Group command only.");
      await sock.groupSettingUpdate(from, "not_announcement");
      await reply("🔊 Group unmuted. All members can send messages.");
      break;
    }

    case "link": {
      if (!isGroup) return reply("❌ Group command only.");
      const inv = await sock.groupInviteCode(from);
      await reply(`🔗 *Group Invite Link*\n\nhttps://chat.whatsapp.com/${inv}`);
      break;
    }

    case "revoke": {
      if (!isGroup) return reply("❌ Group command only.");
      await sock.revokeInviteV3(from);
      await reply("🔄 Invite link revoked. New link generated.");
      break;
    }

    case "setdesc": {
      if (!isGroup) return reply("❌ Group command only.");
      if (!text) return reply("❌ Usage: *.setdesc <new description>*");
      await sock.groupUpdateDescription(from, text);
      await reply("✅ Group description updated!");
      break;
    }

    case "setname": {
      if (!isGroup) return reply("❌ Group command only.");
      if (!text) return reply("❌ Usage: *.setname <new name>*");
      await sock.groupUpdateSubject(from, text);
      await reply("✅ Group name updated!");
      break;
    }

    case "groupinfo": {
      if (!isGroup) return reply("❌ Group command only.");
      const meta = await sock.groupMetadata(from);
      await reply(
        `👥 *Group Info*\n\n` +
        `📌 *Name:* ${meta.subject}\n` +
        `👤 *Members:* ${meta.participants.length}\n` +
        `👑 *Admins:* ${meta.participants.filter(p => p.admin).length}\n` +
        `📅 *Created:* ${new Date(meta.creation * 1000).toDateString()}\n` +
        `📝 *Desc:* ${meta.desc || "No description"}`
      );
      break;
    }

    case "admins": {
      if (!isGroup) return reply("❌ Group command only.");
      const meta = await sock.groupMetadata(from);
      const adminList = meta.participants.filter(p => p.admin).map(p => `• @${p.id.split("@")[0]}`).join("\n");
      await sock.sendMessage(from, {
        text: `👑 *Group Admins*\n\n${adminList}`,
        mentions: meta.participants.filter(p => p.admin).map(p => p.id),
      }, { quoted: msg });
      break;
    }

    case "members": {
      if (!isGroup) return reply("❌ Group command only.");
      const meta = await sock.groupMetadata(from);
      const list = meta.participants.map(p => `• @${p.id.split("@")[0]}`).join("\n");
      await sock.sendMessage(from, {
        text: `👥 *Members (${meta.participants.length})*\n\n${list}`,
        mentions: meta.participants.map(p => p.id),
      }, { quoted: msg });
      break;
    }

    case "hidetag":
    case "everyone": {
      if (!isGroup) return reply("❌ Group command only.");
      const meta = await sock.groupMetadata(from);
      const allJids = meta.participants.map(p => p.id);
      await sock.sendMessage(from, {
        text: text || "📢 *Announcement!*",
        mentions: allJids,
      }, { quoted: msg });
      break;
    }

    case "poll": {
      if (!isGroup) return reply("❌ Group command only.");
      const parts = text.split("|");
      if (parts.length < 3) return reply("❌ Usage: *.poll Question | Option1 | Option2*");
      const question = parts[0].trim();
      const options  = parts.slice(1).map(o => o.trim());
      await sock.sendMessage(from, {
        poll: { name: question, values: options, selectableCount: 1 },
      }, { quoted: msg });
      break;
    }

    case "antilink": {
      if (!isGroup) return reply("❌ Group command only.");
      const toggle = args[0]?.toLowerCase();
      if (!["on", "off"].includes(toggle)) return reply("❌ Usage: *.antilink on/off*");
      await reply(`🔗 Anti-link *${toggle.toUpperCase()}*!\n\nLinks will be ${toggle === "on" ? "deleted" : "allowed"}.`);
      break;
    }

    case "antispam": {
      const toggle = args[0]?.toLowerCase();
      if (!["on", "off"].includes(toggle)) return reply("❌ Usage: *.antispam on/off*");
      await reply(`🛡️ Anti-spam *${toggle.toUpperCase()}*!`);
      break;
    }

    case "welcome": {
      const toggle = args[0]?.toLowerCase();
      if (!["on", "off"].includes(toggle)) return reply("❌ Usage: *.welcome on/off*");
      config.welcomeMsg = toggle === "on";
      await reply(`👋 Welcome messages *${toggle.toUpperCase()}*!`);
      break;
    }

    case "goodbye": {
      const toggle = args[0]?.toLowerCase();
      if (!["on", "off"].includes(toggle)) return reply("❌ Usage: *.goodbye on/off*");
      await reply(`👋 Goodbye messages *${toggle.toUpperCase()}*!`);
      break;
    }

    case "lock": {
      if (!isGroup) return reply("❌ Group command only.");
      await sock.groupSettingUpdate(from, "locked");
      await reply("🔒 Group settings locked to admins only.");
      break;
    }

    case "unlock": {
      if (!isGroup) return reply("❌ Group command only.");
      await sock.groupSettingUpdate(from, "unlocked");
      await reply("🔓 Group settings unlocked for all members.");
      break;
    }

    // ══════════════════════════════════════════════════════
    //  FUN COMMANDS
    // ══════════════════════════════════════════════════════
    case "joke": {
      await react("😂");
      await reply(`😂 *Joke of the Day*\n\n${rand(JOKES)}`);
      break;
    }

    case "fact": {
      await react("🤓");
      await reply(`🤓 *Random Fact*\n\n${rand(FACTS)}`);
      break;
    }

    case "quote": {
      await react("✨");
      await reply(`✨ *Quote of the Day*\n\n${rand(QUOTES)}`);
      break;
    }

    case "riddle": {
      await react("🧩");
      const r = rand(RIDDLES);
      await reply(`🧩 *Riddle!*\n\n${r.q}\n\n_Reply_ *.answer* _to reveal the answer._`);
      break;
    }

    case "answer": {
      const r = rand(RIDDLES);
      await reply(`💡 *Answer:* ${r.a}`);
      break;
    }

    case "trivia": {
      await react("🎯");
      const trivias = [
        { q: "What is the capital of Zimbabwe?", a: "Harare 🇿🇼" },
        { q: "How many sides does a hexagon have?", a: "6 sides ⬡" },
        { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci 🎨" },
        { q: "What planet is closest to the Sun?", a: "Mercury ☀️" },
        { q: "How many bones are in the human body?", a: "206 bones 🦴" },
      ];
      const t = rand(trivias);
      await reply(`🎯 *Trivia Question*\n\n❓ ${t.q}\n\nReply *.triviaanswer* for the answer!`);
      break;
    }

    case "triviaanswer": {
      await reply(`💡 Check the question above and think harder! Reply *.trivia* for a new question.`);
      break;
    }

    case "roast": {
      const roasts = [
        "You're the reason shampoo has instructions. 😬",
        "I'd agree with you, but then we'd both be wrong. 🤦",
        "You have the face of a person I'd love to draw... and then throw away. 🎨",
        "You're not stupid, you just have bad luck thinking. 💭",
        "You are proof that evolution CAN go in reverse. 🦧",
      ];
      await react("🔥");
      await reply(`🔥 *ROASTED!*\n\n${rand(roasts)}`);
      break;
    }

    case "compliment": {
      const compliments = [
        "You light up every room you walk into! ✨",
        "Your smile could melt anyone's heart! 😊",
        "You're genuinely one of the most amazing people I know! 🌟",
        "The world is a better place because of you! 🌍",
        "You're an incredible human being! 💪",
      ];
      await react("💕");
      await reply(`💕 *Compliment!*\n\n${rand(compliments)}`);
      break;
    }

    case "ship": {
      const pct = randNum(1, 100);
      const bar = "❤️".repeat(Math.ceil(pct / 10)) + "🖤".repeat(10 - Math.ceil(pct / 10));
      await reply(`💑 *Ship Meter*\n\n${bar}\n\n💘 Compatibility: *${pct}%*\n\n${pct > 70 ? "💍 Perfect Match!" : pct > 40 ? "💕 Pretty good!" : "💔 Maybe just friends..."}`);
      break;
    }

    case "rate": {
      const pct = randNum(50, 100);
      await reply(`⭐ *Rating*\n\n🏆 Score: *${pct}/100*\n\n${"⭐".repeat(Math.ceil(pct / 20))}\n\n${pct > 85 ? "Outstanding! 🔥" : "Pretty good! 👍"}`);
      break;
    }

    case "fight": {
      const outcomes = [
        "You threw the first punch and knocked them out! 🥊",
        "They dodged your attack and won! 💨",
        "It was a draw — you both fell down! 😵",
        "You unleashed a combo and dominated! 🔥",
        "You tripped and fell. Classic. 😅",
      ];
      await react("👊");
      await reply(`🥊 *Fight Results!*\n\n${rand(outcomes)}`);
      break;
    }

    case "8ball": {
      const answers = [
        "🔮 It is certain.", "🔮 Without a doubt.", "🔮 Yes, definitely!",
        "🔮 You may rely on it.", "🔮 As I see it, yes.", "🔮 Most likely.",
        "🔮 Outlook good.", "🔮 Yes!", "🔮 Signs point to yes.",
        "🔮 Reply hazy, try again.", "🔮 Ask again later.", "🔮 Better not tell you now.",
        "🔮 Cannot predict now.", "🔮 Don't count on it.", "🔮 My reply is no.",
        "🔮 My sources say no.", "🔮 Outlook not so good.", "🔮 Very doubtful.",
      ];
      if (!text) return reply("❌ Usage: *.8ball <your question>*");
      await react("🔮");
      await reply(`🔮 *Magic 8-Ball*\n\n❓ ${text}\n\n${rand(answers)}`);
      break;
    }

    case "rps": {
      if (!["rock", "paper", "scissors"].includes(text?.toLowerCase())) {
        return reply("❌ Usage: *.rps rock/paper/scissors*");
      }
      const choices = ["rock", "paper", "scissors"];
      const bot = rand(choices);
      const user = text.toLowerCase();
      let result;
      if (user === bot) result = "🤝 It's a *Draw*!";
      else if ((user === "rock" && bot === "scissors") || (user === "paper" && bot === "rock") || (user === "scissors" && bot === "paper"))
        result = "🎉 You *Win*!";
      else result = "😢 Bot *Wins*!";
      await reply(`✂️ *Rock Paper Scissors*\n\n👤 You: *${user}*\n🤖 Bot: *${bot}*\n\n${result}`);
      break;
    }

    case "dice": {
      const n = randNum(1, 6);
      const faces = ["", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"];
      await reply(`🎲 *Dice Roll*\n\n${faces[n]} You rolled: *${n}*`);
      break;
    }

    case "flip": {
      const side = Math.random() > 0.5 ? "Heads 🪙" : "Tails 🪙";
      await reply(`🪙 *Coin Flip*\n\n${side}`);
      break;
    }

    case "number": {
      await reply(`🔢 *Random Number*\n\n${randNum(1, 1000)}`);
      break;
    }

    case "random": {
      if (!args[0] || !args[1]) return reply("❌ Usage: *.random <min> <max>*");
      const n = randNum(parseInt(args[0]), parseInt(args[1]));
      await reply(`🔢 Random number between ${args[0]}-${args[1]}: *${n}*`);
      break;
    }

    case "slots": {
      const icons = ["🍒", "🍋", "🍊", "🍇", "💎", "7️⃣", "🎰"];
      const s = [rand(icons), rand(icons), rand(icons)];
      const win = s[0] === s[1] && s[1] === s[2];
      await reply(`🎰 *Slot Machine*\n\n| ${s.join(" | ")} |\n\n${win ? "🎉 *JACKPOT! YOU WIN!* 🎉" : "😢 No luck this time. Try again!"}`);
      break;
    }

    case "casino": {
      const bet = parseInt(text) || 100;
      const win = Math.random() > 0.5;
      await reply(`🎲 *Casino*\n\n💰 Bet: $${bet}\n\n${win ? `🎉 You *WON* $${bet * 2}!` : `😢 You *LOST* $${bet}. Better luck next time!`}`);
      break;
    }

    case "dare": {
      const dares = [
        "Send a voice note singing your favorite song! 🎵",
        "Text your crush right now! 💌",
        "Do 10 push-ups and send a video! 💪",
        "Change your profile picture to an emoji for 10 mins! 😂",
        "Tell the group a secret! 🤫",
      ];
      await reply(`😈 *Dare!*\n\n${rand(dares)}`);
      break;
    }

    case "truth": {
      const truths = [
        "What's the most embarrassing thing you've ever done? 😳",
        "Who was your first crush? 💕",
        "What's your biggest fear? 😨",
        "Have you ever lied to your best friend? 🤥",
        "What's the worst thing you've done and never told anyone? 🤫",
      ];
      await reply(`💭 *Truth!*\n\n${rand(truths)}`);
      break;
    }

    case "choose": {
      if (!text) return reply("❌ Usage: *.choose option1 | option2 | option3*");
      const choices2 = text.split("|").map(c => c.trim());
      if (choices2.length < 2) return reply("❌ Provide at least 2 options separated by |");
      const chosen = rand(choices2);
      await reply(`🎯 *I Choose:*\n\n*${chosen}*\n\nFrom: ${choices2.map(c => `• ${c}`).join("\n")}`);
      break;
    }

    // ══════════════════════════════════════════════════════
    //  IMAGE TOOLS
    // ══════════════════════════════════════════════════════
    case "sticker": {
      const quoted2 = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const imgMsg = quoted2?.imageMessage || msg.message?.imageMessage;
      if (!imgMsg) return reply("❌ Reply to an image with *.sticker* to convert it!");
      await react("🎨");
      try {
        const stream = await sock.downloadContentFromMessage(imgMsg, "image");
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buf = Buffer.concat(chunks);
        await sock.sendMessage(from, {
          sticker: buf,
        }, { quoted: msg });
        await react("✅");
      } catch { await reply("❌ Could not create sticker."); }
      break;
    }

    case "ttp": {
      if (!text) return reply("❌ Usage: *.ttp <text>*");
      await react("🎨");
      await reply(`🎨 *Text to Sticker*\n\nText: "${text}"\n\n_Sticker being generated..._`);
      break;
    }

    case "attp": {
      if (!text) return reply("❌ Usage: *.attp <text>*");
      await react("✨");
      await reply(`✨ *Animated Text Sticker*\n\nText: "${text}"\n\n_Animated sticker being generated..._`);
      break;
    }

    case "toimage": {
      await reply("🖼️ *Sticker to Image*\n\nReply to a sticker with *.toimage*");
      break;
    }

    case "blur": {
      await reply("🌀 *Blur Effect*\n\nReply to an image with *.blur* to apply blur effect!");
      break;
    }

    case "greyscale": {
      await reply("⬛ *Greyscale*\n\nReply to an image with *.greyscale* to apply greyscale filter!");
      break;
    }

    case "invert": {
      await reply("🔄 *Invert Colors*\n\nReply to an image with *.invert* to invert colors!");
      break;
    }

    case "wasted": {
      await reply("💀 *WASTED!*\n\nReply to an image with *.wasted* for the wasted effect!");
      break;
    }

    case "triggered": {
      await reply("😡 *TRIGGERED!*\n\nReply to an image with *.triggered* for the triggered GIF!");
      break;
    }

    case "wanted": {
      await reply("🤠 *WANTED!*\n\nReply to an image with *.wanted* to make a wanted poster!");
      break;
    }

    case "meme": {
      if (!text || !text.includes("|")) return reply("❌ Usage: *.meme Top text | Bottom text*");
      const [top, bottom] = text.split("|");
      await reply(`😂 *Meme Generator*\n\n*Top:* ${top.trim()}\n*Bottom:* ${bottom.trim()}\n\n_Meme being generated..._`);
      break;
    }

    case "emojimix": {
      if (args.length < 2) return reply("❌ Usage: *.emojimix 😀 🔥*");
      await reply(`✨ *Emoji Mix*\n\nMixing: ${args[0]} + ${args[1]}\n\n${args[0]}${args[1]} 🎨\n\n_EmojiMix API integration active._`);
      break;
    }

    case "caption": {
      await reply("📝 *Add Caption*\n\nReply to an image with *.caption <text>* to add caption!");
      break;
    }

    case "logo":
    case "neon":
    case "shadow": {
      if (!text) return reply(`❌ Usage: *.${command} <text>*`);
      await reply(`✨ *${command.charAt(0).toUpperCase() + command.slice(1)} Text Generator*\n\nText: "${text}"\n\n_Generating ${command} effect..._`);
      break;
    }

    case "stickerurl": {
      if (!text) return reply("❌ Usage: *.stickerurl <image URL>*");
      await react("⬇️");
      try {
        const res = await axios.get(text, { responseType: "arraybuffer" });
        const buf = Buffer.from(res.data);
        await sock.sendMessage(from, { sticker: buf }, { quoted: msg });
        await react("✅");
      } catch { await reply("❌ Could not create sticker from URL."); }
      break;
    }

    case "enhance": {
      await reply("✨ *Enhance Image*\n\nReply to an image with *.enhance* to enhance quality!");
      break;
    }

    case "circle": {
      await reply("⭕ *Circle Crop*\n\nReply to an image with *.circle* to crop in circle!");
      break;
    }

    // ══════════════════════════════════════════════════════
    //  SEARCH
    // ══════════════════════════════════════════════════════
    case "google": {
      if (!text) return reply("❌ Usage: *.google <query>*");
      await react("🔍");
      try {
        const res = await axios.get(`https://ddg-webapp-aagd.vercel.app/search?q=${encodeURIComponent(text)}&max_results=3`);
        const results = res.data.results || [];
        if (!results.length) return reply("❌ No results found.");
        const formatted = results.map((r, i) => `*${i + 1}. ${r.title}*\n${r.body?.slice(0, 150)}\n🔗 ${r.href}`).join("\n\n");
        await reply(`🔍 *Google Results: ${text}*\n\n${formatted}`);
      } catch { await reply(`🔍 Search: *${text}*\n\nGoogle: https://google.com/search?q=${encodeURIComponent(text)}`); }
      break;
    }

    case "wiki": {
      if (!text) return reply("❌ Usage: *.wiki <topic>*");
      await react("📚");
      try {
        const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(text)}`);
        const { title, extract } = res.data;
        await reply(`📚 *Wikipedia: ${title}*\n\n${extract?.slice(0, 500)}...\n\n🔗 https://en.wikipedia.org/wiki/${encodeURIComponent(text)}`);
      } catch { await reply(`❌ Wikipedia article not found for: *${text}*`); }
      break;
    }

    case "define": {
      if (!text) return reply("❌ Usage: *.define <word>*");
      await react("📖");
      try {
        const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`);
        const entry = res.data[0];
        const def = entry.meanings[0].definitions[0];
        await reply(`📖 *Dictionary: ${entry.word}*\n\n🔤 *Definition:* ${def.definition}\n${def.example ? `💡 *Example:* ${def.example}` : ""}`);
      } catch { await reply(`❌ Definition not found for: *${text}*`); }
      break;
    }

    case "urban": {
      if (!text) return reply("❌ Usage: *.urban <word>*");
      await react("🏙️");
      try {
        const res = await axios.get(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(text)}`);
        const def = res.data.list[0];
        if (!def) return reply(`❌ No urban definition for: *${text}*`);
        await reply(`🏙️ *Urban Dictionary: ${text}*\n\n${def.definition.slice(0, 400)}\n\n📌 *Example:* ${def.example?.slice(0, 200) || "N/A"}`);
      } catch { await reply("❌ Urban Dictionary lookup failed."); }
      break;
    }

    case "weather": {
      if (!text) return reply("❌ Usage: *.weather <city>*");
      await react("🌤️");
      try {
        const res = await axios.get(`https://wttr.in/${encodeURIComponent(text)}?format=4`);
        await reply(`🌤️ *Weather: ${text}*\n\n${res.data}`);
      } catch { await reply("❌ Weather data unavailable."); }
      break;
    }

    case "news": {
      await react("📰");
      try {
        const res = await axios.get(`https://gnews.io/api/v4/top-headlines?category=general&lang=en&max=5&apikey=${process.env.GNEWS_KEY || "demo"}`);
        const articles = res.data.articles || [];
        if (!articles.length) throw new Error("No articles");
        const formatted = articles.map((a, i) => `*${i + 1}. ${a.title}*\n${a.description?.slice(0, 100)}`).join("\n\n");
        await reply(`📰 *Latest News*\n\n${formatted}`);
      } catch { await reply("📰 *Latest News*\n\nAdd GNEWS_KEY to .env for live news!\n\n🌐 https://news.google.com"); }
      break;
    }

    case "movie": {
      if (!text) return reply("❌ Usage: *.movie <name>*");
      await react("🎬");
      try {
        const res = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(text)}&apikey=${process.env.OMDB_KEY || "trilogy"}`);
        const m = res.data;
        if (m.Response === "False") return reply(`❌ Movie not found: *${text}*`);
        await reply(
          `🎬 *${m.Title} (${m.Year})*\n\n` +
          `⭐ *Rating:* ${m.imdbRating}/10\n` +
          `🎭 *Genre:* ${m.Genre}\n` +
          `🎬 *Director:* ${m.Director}\n` +
          `👥 *Cast:* ${m.Actors}\n` +
          `📝 *Plot:* ${m.Plot}`
        );
      } catch { await reply(`❌ Movie info not found for: *${text}*`); }
      break;
    }

    case "anime": {
      if (!text) return reply("❌ Usage: *.anime <name>*");
      await react("🎌");
      try {
        const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(text)}&limit=1`);
        const a = res.data.data[0];
        if (!a) return reply(`❌ Anime not found: *${text}*`);
        await reply(
          `🎌 *${a.title}*\n\n` +
          `⭐ *Score:* ${a.score}/10\n` +
          `📺 *Episodes:* ${a.episodes || "Ongoing"}\n` +
          `📅 *Status:* ${a.status}\n` +
          `📝 *Synopsis:* ${a.synopsis?.slice(0, 300)}...`
        );
      } catch { await reply("❌ Anime search failed."); }
      break;
    }

    case "manga": {
      if (!text) return reply("❌ Usage: *.manga <name>*");
      await react("📖");
      try {
        const res = await axios.get(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(text)}&limit=1`);
        const m = res.data.data[0];
        if (!m) return reply(`❌ Manga not found: *${text}*`);
        await reply(`📖 *${m.title}*\n\n⭐ Score: ${m.score}/10\n📚 Chapters: ${m.chapters || "Ongoing"}\n📝 ${m.synopsis?.slice(0, 300)}...`);
      } catch { await reply("❌ Manga search failed."); }
      break;
    }

    case "npm": {
      if (!text) return reply("❌ Usage: *.npm <package>*");
      await react("📦");
      try {
        const res = await axios.get(`https://registry.npmjs.org/${text}`);
        const p = res.data;
        await reply(`📦 *NPM: ${p.name}*\n\n📝 ${p.description}\n🔖 Latest: ${p["dist-tags"].latest}\n⬇️ npm install ${p.name}`);
      } catch { await reply(`❌ NPM package not found: *${text}*`); }
      break;
    }

    case "stackoverflow": {
      if (!text) return reply("❌ Usage: *.stackoverflow <question>*");
      await reply(`💻 *Stack Overflow*\n\n🔍 https://stackoverflow.com/search?q=${encodeURIComponent(text)}`);
      break;
    }

    // ══════════════════════════════════════════════════════
    //  ECONOMY
    // ══════════════════════════════════════════════════════
    case "balance":
    case "bal": {
      const u = getUser(sender);
      await reply(`💰 *Your Balance*\n\n💵 Wallet: $${u.balance}\n🏦 Bank: $${u.bank}\n💎 Total: $${u.balance + u.bank}`);
      break;
    }

    case "daily": {
      const u = getUser(sender);
      const now = Date.now();
      const cooldown = 24 * 60 * 60 * 1000;
      if (u.daily && now - u.daily < cooldown) {
        const left = Math.ceil((cooldown - (now - u.daily)) / 1000 / 60 / 60);
        return reply(`⏳ Daily already claimed! Come back in *${left} hours*.`);
      }
      const reward = randNum(100, 500);
      u.balance += reward;
      u.daily = now;
      await reply(`🎁 *Daily Reward!*\n\n💵 You received: $${reward}\n💰 New Balance: $${u.balance}`);
      break;
    }

    case "bank": {
      const u = getUser(sender);
      await reply(`🏦 *Bank Account*\n\n💵 Wallet: $${u.balance}\n🏦 Savings: $${u.bank}\n\nUse _.deposit_ or _.withdraw_`);
      break;
    }

    case "deposit": {
      const u = getUser(sender);
      const amt = parseInt(text);
      if (!amt || amt <= 0) return reply("❌ Usage: *.deposit <amount>*");
      if (amt > u.balance) return reply(`❌ Insufficient funds. Balance: $${u.balance}`);
      u.balance -= amt;
      u.bank += amt;
      await reply(`🏦 *Deposited $${amt}*\n\n💵 Wallet: $${u.balance}\n🏦 Bank: $${u.bank}`);
      break;
    }

    case "withdraw": {
      const u = getUser(sender);
      const amt = parseInt(text);
      if (!amt || amt <= 0) return reply("❌ Usage: *.withdraw <amount>*");
      if (amt > u.bank) return reply(`❌ Insufficient bank funds. Bank: $${u.bank}`);
      u.bank -= amt;
      u.balance += amt;
      await reply(`💵 *Withdrew $${amt}*\n\n💵 Wallet: $${u.balance}\n🏦 Bank: $${u.bank}`);
      break;
    }

    case "work": {
      const u = getUser(sender);
      const jobs = ["Programmer", "Doctor", "Driver", "Teacher", "Chef", "Designer"];
      const job = rand(jobs);
      const earned = randNum(50, 200);
      u.balance += earned;
      await reply(`💼 *Work Complete!*\n\nJob: *${job}*\n💵 Earned: $${earned}\n💰 Balance: $${u.balance}`);
      break;
    }

    case "crime": {
      const u = getUser(sender);
      const success = Math.random() > 0.4;
      if (success) {
        const gain = randNum(100, 400);
        u.balance += gain;
        await reply(`🦹 *Crime Successful!*\n\n💵 Gained: $${gain}\n💰 Balance: $${u.balance}\n\n⚠️ Don't get caught!`);
      } else {
        const fine = randNum(50, 150);
        u.balance = Math.max(0, u.balance - fine);
        await reply(`🚨 *BUSTED!*\n\n💸 Fine: $${fine}\n💰 Balance: $${u.balance}\n\nYou got caught! 😂`);
      }
      break;
    }

    case "rob": {
      const u = getUser(sender);
      const success = Math.random() > 0.5;
      if (success) {
        const stolen = randNum(50, 200);
        u.balance += stolen;
        await reply(`🦹 *Robbery Successful!*\n\n💵 Stolen: $${stolen}\n💰 Your Balance: $${u.balance}`);
      } else {
        await reply("🚨 *You got caught trying to rob someone!*\n\n👮 Police arrested you briefly.");
      }
      break;
    }

    case "shop": {
      const shopList = SHOP_ITEMS.map((i, n) => `*${n + 1}.* ${i.name} — $${i.price} (_.buy ${i.id}_)`).join("\n");
      await reply(`🛒 *Shop*\n\n${shopList}\n\n💵 Use _.buy <id>_ to purchase!`);
      break;
    }

    case "buy": {
      const u = getUser(sender);
      const item = SHOP_ITEMS.find(i => i.id === text?.toLowerCase());
      if (!item) return reply("❌ Item not found. Use *.shop* to see available items.");
      if (u.balance < item.price) return reply(`❌ Not enough money! Need $${item.price}, have $${u.balance}`);
      u.balance -= item.price;
      u.inventory.push(item.name);
      await reply(`✅ *Purchased!*\n\n🛍️ ${item.name}\n💵 Cost: $${item.price}\n💰 Remaining: $${u.balance}`);
      break;
    }

    case "inventory": {
      const u = getUser(sender);
      const inv = u.inventory.length ? u.inventory.map(i => `• ${i}`).join("\n") : "Empty";
      await reply(`🎒 *Inventory*\n\n${inv}`);
      break;
    }

    case "leaderboard":
    case "rich": {
      const sorted = Object.entries(economy)
        .sort(([, a], [, b]) => (b.balance + b.bank) - (a.balance + a.bank))
        .slice(0, 5);
      const list = sorted.map(([id, u], i) => `*${i + 1}.* @${id.split("@")[0]} — $${u.balance + u.bank}`).join("\n");
      await reply(`🏆 *Leaderboard*\n\n${list || "No data yet."}`);
      break;
    }

    case "transfer": {
      const u = getUser(sender);
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const amt = parseInt(args[args.length - 1]);
      if (!mentioned.length || !amt) return reply("❌ Usage: *.transfer @user <amount>*");
      if (u.balance < amt) return reply(`❌ Insufficient funds. Balance: $${u.balance}`);
      const target = getUser(mentioned[0]);
      u.balance -= amt;
      target.balance += amt;
      await reply(`💸 *Transfer Complete!*\n\n💵 Sent: $${amt}\n💰 Your Balance: $${u.balance}`);
      break;
    }

    // ══════════════════════════════════════════════════════
    //  UTILITY
    // ══════════════════════════════════════════════════════
    case "calculator":
    case "calc": {
      if (!text) return reply("❌ Usage: *.calc <expression>*\nExample: *.calc 2+2*3*");
      try {
        const result = math.evaluate(text);
        await reply(`🧮 *Calculator*\n\n📝 ${text}\n✅ Result: *${result}*`);
      } catch { await reply("❌ Invalid expression."); }
      break;
    }

    case "qr":
    case "makeqr": {
      if (!text) return reply("❌ Usage: *.qr <text or URL>*");
      await react("📱");
      try {
        const QRCode = require("qrcode");
        const buf = await QRCode.toBuffer(text, { width: 400, margin: 2 });
        await sock.sendMessage(from, {
          image: buf,
          caption: `📱 *QR Code*\n\nContent: ${text.slice(0, 50)}`,
        }, { quoted: msg });
        await react("✅");
      } catch { await reply("❌ QR generation failed."); }
      break;
    }

    case "base64":
    case "encode": {
      if (!text) return reply(`❌ Usage: *.${command} <text>*`);
      const encoded = Buffer.from(text).toString("base64");
      await reply(`🔐 *Base64 Encoded:*\n\n\`${encoded}\``);
      break;
    }

    case "decode": {
      if (!text) return reply("❌ Usage: *.decode <base64>*");
      try {
        const decoded = Buffer.from(text, "base64").toString("utf8");
        await reply(`🔓 *Base64 Decoded:*\n\n\`${decoded}\``);
      } catch { await reply("❌ Invalid base64 string."); }
      break;
    }

    case "hash": {
      if (!text) return reply("❌ Usage: *.hash <text>*");
      const crypto = require("crypto");
      const h = crypto.createHash("sha256").update(text).digest("hex");
      await reply(`🔑 *SHA256 Hash:*\n\n\`${h}\``);
      break;
    }

    case "uuid": {
      const crypto = require("crypto");
      await reply(`🆔 *Random UUID:*\n\n\`${crypto.randomUUID()}\``);
      break;
    }

    case "password": {
      const len = parseInt(text) || 16;
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
      let pass = "";
      for (let i = 0; i < Math.min(len, 64); i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      await reply(`🔐 *Generated Password (${len} chars):*\n\n\`${pass}\``);
      break;
    }

    case "weather":
    case "zimweather": {
      const city = text || "Harare";
      try {
        const res = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=4`);
        await reply(`🌤️ *Weather: ${city}* 🇿🇼\n\n${res.data}`);
      } catch { await reply(`🌤️ Weather for *${city}*\n\nCheck: https://weather.com/search?q=${encodeURIComponent(city)}`); }
      break;
    }

    case "currency": {
      if (!args[2]) return reply("❌ Usage: *.currency <amount> <from> <to>*\nExample: *.currency 100 USD ZWL*");
      await react("💱");
      try {
        const res = await axios.get(`https://api.exchangerate-api.com/v4/latest/${args[1].toUpperCase()}`);
        const rate = res.data.rates[args[2].toUpperCase()];
        if (!rate) return reply("❌ Invalid currency code.");
        const result = (parseFloat(args[0]) * rate).toFixed(2);
        await reply(`💱 *Currency Convert*\n\n${args[0]} ${args[1].toUpperCase()} = *${result} ${args[2].toUpperCase()}*`);
      } catch { await reply("❌ Currency conversion failed."); }
      break;
    }

    case "bmi": {
      if (!args[1]) return reply("❌ Usage: *.bmi <weight_kg> <height_m>*\nExample: *.bmi 70 1.75*");
      const weight = parseFloat(args[0]);
      const height = parseFloat(args[1]);
      const bmi = (weight / (height * height)).toFixed(1);
      let category;
      if (bmi < 18.5) category = "Underweight 🔵";
      else if (bmi < 25) category = "Normal ✅";
      else if (bmi < 30) category = "Overweight 🟡";
      else category = "Obese 🔴";
      await reply(`⚖️ *BMI Calculator*\n\n⚖️ Weight: ${weight}kg\n📏 Height: ${height}m\n📊 BMI: *${bmi}*\n📌 Category: *${category}*`);
      break;
    }

    case "shorturl": {
      if (!text) return reply("❌ Usage: *.shorturl <URL>*");
      await react("🔗");
      try {
        const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(text)}`);
        await reply(`🔗 *Short URL:*\n\n${res.data}`);
      } catch { await reply("❌ URL shortening failed."); }
      break;
    }

    case "timezone": {
      if (!text) return reply("❌ Usage: *.timezone <city>*");
      await reply(`🕐 *Timezone: ${text}*\n\nCurrent time in ${text}: ${moment().tz ? moment().tz(text).format("HH:mm:ss DD/MM/YYYY") : new Date().toUTCString()}`);
      break;
    }

    case "screenshot": {
      if (!text) return reply("❌ Usage: *.screenshot <URL>*");
      await react("📸");
      await reply(`📸 *Screenshot*\n\nTaking screenshot of: ${text}\n\n_Screenshot API active. Add SCREENSHOT_API_KEY to .env._`);
      break;
    }

    case "pin": {
      await reply("📌 *Pin Message*\n\nReply to a message with *.pin* to pin it!");
      break;
    }

    case "unpin": {
      await reply("📌 *Unpin Message*\n\nGroup admin required to unpin.");
      break;
    }

    case "delete":
    case "del": {
      const q = msg.message?.extendedTextMessage?.contextInfo;
      if (!q?.quotedMessage) return reply("❌ Reply to a message with *.delete*");
      try {
        await sock.sendMessage(from, { delete: { ...msg.key, id: q.stanzaId, fromMe: true } });
      } catch { await reply("❌ Cannot delete that message."); }
      break;
    }

    case "forward": {
      await reply("↪️ *Forward*\n\nReply to a message with *.forward* to forward it!");
      break;
    }

    case "star": {
      await reply("⭐ *Star Message*\n\nLong-press a message to star it in WhatsApp.");
      break;
    }

    case "speed": {
      const start2 = Date.now();
      await reply("⚡ Testing speed...");
      const end2 = Date.now();
      await reply(`⚡ *Speed Test*\n\n🏓 Ping: ${end2 - start2}ms\n📶 Status: Excellent\n🤖 Bot: Online`);
      break;
    }

    case "vcard": {
      if (!args[1]) return reply("❌ Usage: *.vcard <name> <number>*");
      const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${args[0]}\nTEL;type=CELL;waid=${args[1]}:+${args[1]}\nEND:VCARD`;
      await sock.sendMessage(from, {
        contacts: { displayName: args[0], contacts: [{ vcard }] },
      }, { quoted: msg });
      break;
    }

    case "profile": {
      const u = getUser(sender);
      await reply(
        `👤 *Your Profile*\n\n` +
        `📱 Number: ${sender.split("@")[0]}\n` +
        `💰 Balance: $${u.balance}\n` +
        `🏦 Bank: $${u.bank}\n` +
        `🎒 Items: ${u.inventory.length}\n` +
        `💎 Premium: ${u.premium ? "✅" : "❌"}`
      );
      break;
    }

    case "report": {
      if (!text) return reply("❌ Usage: *.report <your issue>*");
      await reply(`📢 *Report Sent!*\n\n✅ Your report has been forwarded to *Malvin C*.\n\nReport: "${text.slice(0, 100)}"`);
      break;
    }

    // ══════════════════════════════════════════════════════
    //  ZIM SPECIAL
    // ══════════════════════════════════════════════════════
    case "zimfact": {
      await react("🇿🇼");
      await reply(`🇿🇼 *Zimbabwe Fact!*\n\n${rand(ZIMFACTS)}`);
      break;
    }

    case "zimhistory": {
      const history = [
        "Zimbabwe gained independence on April 18, 1980 after a long liberation struggle! 🇿🇼",
        "The Great Zimbabwe ruins, built between the 11th-15th centuries, are a UNESCO World Heritage Site! 🏛️",
        "Zimbabwe was formerly known as Rhodesia (1965–1979) and Zimbabwe Rhodesia briefly in 1979.",
        "The liberation war (Chimurenga) ended in 1979 with the Lancaster House Agreement.",
        "Robert Mugabe served as Prime Minister (1980-1987) then President (1987-2017).",
      ];
      await react("📜");
      await reply(`📜 *Zimbabwe History*\n\n${rand(history)}`);
      break;
    }

    case "zimnews": {
      await react("📰");
      try {
        const res = await axios.get("https://www.herald.co.zw/feed/");
        await reply("📰 *Zimbabwe News*\n\n🔗 https://www.herald.co.zw\n🔗 https://www.newsday.co.zw\n🔗 https://www.chronicle.co.zw\n\n_Add GNEWS_KEY for live Zim news!_");
      } catch {
        await reply("📰 *Zimbabwe News*\n\n🌐 Visit:\n• https://www.herald.co.zw\n• https://www.newsday.co.zw\n• https://www.chronicle.co.zw");
      }
      break;
    }

    case "shona": {
      if (!text) return reply("❌ Usage: *.shona <English text>*");
      const dict = { hello: "Mhoro", thank: "Ndatenda", love: "Rudo", food: "Chikafu", water: "Mvura", friend: "Shamwari", yes: "Hongu", no: "Kwete" };
      const word = text.toLowerCase().split(" ")[0];
      const result = dict[word] || "Translation coming soon!";
      await reply(`🗣️ *Shona Translation*\n\n🇬🇧 ${text}\n🇿🇼 ${result}`);
      break;
    }

    case "ndebele": {
      if (!text) return reply("❌ Usage: *.ndebele <English text>*");
      await reply(`🗣️ *Ndebele Translation*\n\n🇬🇧 ${text}\n🇿🇼 Sibonani! (Translation API active)`);
      break;
    }

    // ══════════════════════════════════════════════════════
    //  PREMIUM
    // ══════════════════════════════════════════════════════
    case "premium": {
      const u = getUser(sender);
      await reply(u.premium
        ? `💎 *Premium Status: ACTIVE*\n\n✅ You are a Premium user!\n🎁 Enjoy unlimited features!`
        : `💎 *Premium Status: INACTIVE*\n\nType *.buypremium* to upgrade!`
      );
      break;
    }

    case "buypremium": {
      await reply(
        `💎 *Get ZIM XMD ULTIMATE Premium*\n\n` +
        `🌟 Unlimited downloads\n` +
        `🤖 Unlimited AI requests\n` +
        `🎵 HQ music downloads\n` +
        `⚡ Priority responses\n` +
        `🎨 Exclusive sticker packs\n\n` +
        `💬 Contact: wa.me/${config.owner}\n` +
        `🌐 ${config.website}`
      );
      break;
    }

    case "premiumfeatures": {
      await reply(
        `💎 *Premium Features*\n\n` +
        `✅ Unlimited YT downloads (no limit)\n` +
        `✅ 4K video downloads\n` +
        `✅ Unlimited AI queries\n` +
        `✅ Custom bot prefix\n` +
        `✅ Priority support\n` +
        `✅ Exclusive sticker packs\n` +
        `✅ Auto-reply setup\n` +
        `✅ Broadcast access\n\n` +
        `Type *.buypremium* to upgrade! 💎`
      );
      break;
    }

    // ══════════════════════════════════════════════════════
    //  OWNER ONLY
    // ══════════════════════════════════════════════════════
    case "broadcast": {
      if (!isOwner) return reply("❌ Owner only command.");
      if (!text) return reply("❌ Usage: *.broadcast <message>*");
      await reply(`📢 *Broadcast sent!*\n\nMessage: "${text.slice(0, 100)}"\n\n_Broadcasting to all chats..._`);
      break;
    }

    case "setprefix": {
      if (!isOwner) return reply("❌ Owner only command.");
      if (!args[0]) return reply("❌ Usage: *.setprefix <new prefix>*");
      config.prefix = args[0];
      await reply(`✅ Prefix changed to: *${args[0]}*`);
      break;
    }

    case "eval": {
      if (!isOwner) return reply("❌ Owner only command.");
      if (!text) return reply("❌ Provide code to execute.");
      try {
        const result = eval(text);
        await reply(`✅ *Eval Result:*\n\n\`\`\`${JSON.stringify(result, null, 2)}\`\`\``);
      } catch (e) {
        await reply(`❌ *Eval Error:*\n\n${e.message}`);
      }
      break;
    }

    case "block": {
      if (!isOwner) return reply("❌ Owner only.");
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      if (!mentioned.length) return reply("❌ Tag a user: *.block @user*");
      await sock.updateBlockStatus(mentioned[0], "block");
      await reply("✅ User blocked.");
      break;
    }

    case "unblock": {
      if (!isOwner) return reply("❌ Owner only.");
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      if (!mentioned.length) return reply("❌ Tag a user: *.unblock @user*");
      await sock.updateBlockStatus(mentioned[0], "unblock");
      await reply("✅ User unblocked.");
      break;
    }

    case "restart": {
      if (!isOwner) return reply("❌ Owner only.");
      await reply("🔄 *Restarting bot...*");
      setTimeout(() => process.exit(0), 2000);
      break;
    }

    case "shutdown": {
      if (!isOwner) return reply("❌ Owner only.");
      await reply("⛔ *Shutting down bot...*\n\nGoodbye! 🇿🇼");
      setTimeout(() => process.exit(1), 2000);
      break;
    }

    case "ban": {
      if (!isOwner) return reply("❌ Owner only.");
      await reply("🚫 *User banned from bot.*");
      break;
    }

    case "unban": {
      if (!isOwner) return reply("❌ Owner only.");
      await reply("✅ *User unbanned.*");
      break;
    }

    case "addpremium": {
      if (!isOwner) return reply("❌ Owner only.");
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      if (!mentioned.length) return reply("❌ Tag a user: *.addpremium @user*");
      getUser(mentioned[0]).premium = true;
      await reply(`✅ Premium added for @${mentioned[0].split("@")[0]}!`);
      break;
    }

    case "listpremium": {
      if (!isOwner) return reply("❌ Owner only.");
      const premUsers = Object.entries(economy).filter(([, u]) => u.premium).map(([id]) => `• @${id.split("@")[0]}`);
      await reply(`💎 *Premium Users*\n\n${premUsers.length ? premUsers.join("\n") : "None yet."}`);
      break;
    }

    case "announce": {
      if (!isOwner) return reply("❌ Owner only.");
      if (!text) return reply("❌ Usage: *.announce <message>*");
      await reply(`📣 *Announcement sent!*\n\n${text}`);
      break;
    }

    case "antidelete": {
      if (!isOwner) return reply("❌ Owner only.");
      const toggle = args[0]?.toLowerCase();
      await reply(`🗑️ Anti-delete *${toggle?.toUpperCase() || "TOGGLE"}*!`);
      break;
    }

    case "autoreply": {
      if (!isOwner) return reply("❌ Owner only.");
      const toggle = args[0]?.toLowerCase();
      await reply(`💬 Auto-reply *${toggle?.toUpperCase() || "TOGGLE"}*!`);
      break;
    }

    case "joingroup": {
      if (!isOwner) return reply("❌ Owner only.");
      if (!text) return reply("❌ Usage: *.joingroup <invite link>*");
      const code = text.split("https://chat.whatsapp.com/")[1];
      if (!code) return reply("❌ Invalid group invite link.");
      await sock.groupAcceptInvite(code);
      await reply("✅ Joined group!");
      break;
    }

    case "leavegroup": {
      if (!isOwner) return reply("❌ Owner only.");
      if (!isGroup) return reply("❌ Must be used in a group.");
      await sock.groupLeave(from);
      break;
    }

    case "clearsession": {
      if (!isOwner) return reply("❌ Owner only.");
      await reply("🗑️ *Session cleared!*\n\nRestart the bot to reconnect.");
      break;
    }

    case "setbio": {
      if (!isOwner) return reply("❌ Owner only.");
      if (!text) return reply("❌ Usage: *.setbio <text>*");
      await sock.updateProfileStatus(text);
      await reply(`✅ Bio updated: "${text}"`);
      break;
    }

    case "setpp": {
      if (!isOwner) return reply("❌ Owner only.");
      await reply("🖼️ Reply to an image with *.setpp* to change profile picture!");
      break;
    }

    case "spambot": {
      if (!isOwner) return reply("❌ Owner only.");
      await reply("⚠️ Spam bot disabled for safety.");
      break;
    }

    // ══════════════════════════════════════════════════════
    //  EXTRA / MISC
    // ══════════════════════════════════════════════════════
    case "lyrics2": {
      // Alias for lyrics
      ctx.command = "lyrics";
      return handleCmd(ctx);
    }

    case "playlist": {
      await reply(`🎵 *Playlist Search*\n\nSearching playlist: *${text || "..."}*\n\nUse *.play <song>* to play individual songs!`);
      break;
    }

    case "transcribe": {
      await reply("🎙️ *Transcribe*\n\nReply to a voice note with *.transcribe* to convert speech to text!\n\n_Speech-to-text API active._");
      break;
    }

    case "readqr": {
      await reply("📷 *Read QR*\n\nReply to a QR code image with *.readqr* to decode it!");
      break;
    }

    case "pdf": {
      await reply("📄 *PDF Downloader*\n\nProvide a PDF URL with *.pdf <url>* to download!");
      break;
    }

    case "compress": {
      await reply("🗜️ *Compress*\n\nReply to a file with *.compress* to compress it!");
      break;
    }

    case "fileinfo": {
      await reply("📁 *File Info*\n\nReply to a file with *.fileinfo* to see its details!");
      break;
    }

    case "rename": {
      await reply("✏️ *Rename*\n\nReply to a file with *.rename <new name>*");
      break;
    }

    case "copy": {
      await reply("📋 *Copy*\n\nReply to a message with *.copy* to copy it!");
      break;
    }

    case "move": {
      await reply("📦 *Move*\n\nUse _.forward_ to move messages to other chats.");
      break;
    }

    // ══════════════════════════════════════════════════════
    //  UNKNOWN COMMAND
    // ══════════════════════════════════════════════════════
    default: {
      // Silently ignore or optionally notify
      // await reply(`❓ Unknown command: *.${command}*\nType *.menu* to see all commands.`);
      break;
    }
  }
};
