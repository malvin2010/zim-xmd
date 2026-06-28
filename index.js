// ============================================================
//   ZIM XMD ULTIMATE — Main Entry Point
//   Bot by Malvin C | Made in Zimbabwe 🇿🇼
// ============================================================

const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  isJidBroadcast,
} = require("@whiskeysockets/baileys");

const pino        = require("pino");
const { Boom }    = require("@hapi/boom");
const fs          = require("fs-extra");
const path        = require("path");
const config      = require("./config");
const handleCmd   = require("./commands/index");

fs.ensureDirSync(path.join(__dirname, "tmp"));
fs.ensureDirSync(path.join(__dirname, "auth_info"));

// Web / pairing server (starts immediately)
require("./lib/server");

// Simple in-memory message cache (replaces makeInMemoryStore)
const msgCache = new Map();

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(
    path.join(__dirname, "auth_info")
  );
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger:            pino({ level: "silent" }),
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys:  makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
    },
    browser:           ["ZIM XMD ULTIMATE", "Chrome", "3.0.0"],
    generateHighQualityLinkPreview: true,
    shouldIgnoreJid: jid => isJidBroadcast(jid),
    getMessage: async (key) => {
      const cached = msgCache.get(key.id);
      return cached || { conversation: "" };
    },
  });

  global._sock = sock;

  // Cache messages for reply context
  sock.ev.on("messages.upsert", ({ messages }) => {
    for (const m of messages) {
      if (m.key?.id) {
        msgCache.set(m.key.id, m.message);
        // Keep cache lean — max 200 messages
        if (msgCache.size > 200) {
          const firstKey = msgCache.keys().next().value;
          msgCache.delete(firstKey);
        }
      }
    }
  });

  sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      global._currentQR = qr;
      if (global._io) global._io.emit("qr", qr);
    }

    if (connection === "close") {
      const code      = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const reconnect = code !== DisconnectReason.loggedOut;
      console.log("[ZIM XMD] Disconnected. Code:", code, "| Reconnect:", reconnect);
      global._sock = null;

      if (reconnect) {
        // Code 408 = WhatsApp timeout (host was sleeping). Use longer delay.
        const delay = (code === 408 || code === 503) ? 15000 : 4000;
        console.log(`[ZIM XMD] Reconnecting in ${delay / 1000}s...`);
        setTimeout(startBot, delay);
      } else {
        console.log("[ZIM XMD] Logged out — please re-pair.");
      }
    }

    if (connection === "open") {
      global._currentQR = null;
      if (global._io) global._io.emit("connected");
      console.log(`
╔══════════════════════════════════════════╗
║      ZIM XMD ULTIMATE — ONLINE ✅        ║
║   Bot by Malvin C | Zimbabwe 🇿🇼          ║
║   280+ Commands Active | 24/7 Uptime     ║
╚══════════════════════════════════════════╝`);
      try {
        await sock.sendMessage(config.owner + "@s.whatsapp.net", {
          text:
            "╔══════════════════════════╗\n" +
            "║  *ZIM XMD ULTIMATE* 🚀   ║\n" +
            "╚══════════════════════════╝\n\n" +
            "✅ Bot is now *ONLINE*!\n" +
            "🤖 *280+ Commands* Active\n" +
            "🌍 Made in *Zimbabwe* 🇿🇼\n" +
            "👨‍💻 By *Malvin C*\n\n" +
            "Type *.menu* to see all commands!\n" +
            "🌐 " + config.website,
        });
      } catch (_) {}
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const msg of messages) {
      if (!msg.message) continue;

      // Skip status broadcasts
      if (msg.key.remoteJid === "status@broadcast") continue;

      if (config.autoRead) {
        try { await sock.readMessages([msg.key]); } catch (_) {}
      }

      const from    = msg.key.remoteJid;
      const sender  = msg.key.participant || msg.key.remoteJid;
      const isGroup = from.endsWith("@g.us");
      const isOwner = sender.replace(/[^0-9]/g, "").includes(
        config.owner.replace(/[^0-9]/g, "")
      );

      const body =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption ||
        msg.message?.buttonsResponseMessage?.selectedButtonId ||
        msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
        "";

      const prefix = config.prefix;

      // .malvinsay handler
      if (body.toLowerCase().startsWith(prefix + "malvinsay ")) {
        const sayText = body.slice((prefix + "malvinsay ").length).trim();
        if (!sayText) continue;
        try {
          const axios = require("axios");
          const url   = "https://translate.google.com/translate_tts?ie=UTF-8&q=" +
                        encodeURIComponent(sayText) + "&tl=en&client=tw-ob";
          const r = await axios.get(url, {
            responseType: "arraybuffer",
            headers: { "User-Agent": "Mozilla/5.0", Referer: "https://translate.google.com/" },
          });
          await sock.sendMessage(from,
            { audio: Buffer.from(r.data), mimetype: "audio/mpeg", ptt: true },
            { quoted: msg }
          );
        } catch (e) {
          await sock.sendMessage(from, { text: "❌ TTS error: " + e.message }, { quoted: msg });
        }
        continue;
      }

      const isCmd = body.startsWith(prefix);
      if (!isCmd) continue;

      const command = body.slice(prefix.length).trim().split(/\s+/)[0].toLowerCase();
      const args    = body.trim().split(/\s+/).slice(1);
      const text    = args.join(" ");
      const quoted  = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

      const ctx = {
        sock, msg, from, sender, isGroup, isOwner,
        args, text, body, command, quoted, config, prefix,
        reply: async (content) => {
          if (typeof content === "string")
            return sock.sendMessage(from, { text: content }, { quoted: msg });
          return sock.sendMessage(from, content, { quoted: msg });
        },
        react: async (emoji) =>
          sock.sendMessage(from, { react: { text: emoji, key: msg.key } }),
      };

      try {
        if (config.autoTyping) await sock.sendPresenceUpdate("composing", from);
        await handleCmd(ctx);
        await sock.sendPresenceUpdate("paused", from);
      } catch (err) {
        console.error("[CMD ERROR] ." + command + " →", err.message);
        try {
          await sock.sendMessage(from,
            { text: "❌ *Error in ." + command + "*\n\n" + err.message },
            { quoted: msg }
          );
        } catch (_) {}
      }
    }
  });

  sock.ev.on("group-participants.update", async ({ id, participants, action }) => {
    try {
      const meta    = await sock.groupMetadata(id);
      const admins  = meta.participants.filter(p => p.admin).length;
      const members = meta.participants.length;

      for (const jid of participants) {
        const num = jid.split("@")[0];

        if (action === "add" && config.welcomeMsg) {
          await sock.sendMessage(id, {
            text:
              "┌ *WELCOME TO " + meta.subject.toUpperCase() + "* 🎉\n" +
              "├ *BOT:* ZIM XMD ULTIMATE\n" +
              "├ *USER:* @" + num + "\n" +
              "├ *ADMINS:* " + admins + "\n" +
              "├ *MEMBERS:* " + members + "\n" +
              "└ *DATE:* " + new Date().toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric"
              }) + "\n\n" +
              "│ MADE BY MALVIN C 🇿🇼",
            mentions: [jid],
          });
        }

        if (action === "remove") {
          await sock.sendMessage(id, {
            text:
              "┌ *GOODBYE FROM " + meta.subject.toUpperCase() + "* 👋\n" +
              "├ *BOT:* ZIM XMD ULTIMATE\n" +
              "├ *USER:* @" + num + "\n" +
              "├ *MEMBERS LEFT:* " + members + "\n" +
              "└ *DATE:* " + new Date().toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric"
              }) + "\n\n" +
              "│ MADE BY MALVIN C 🇿🇼",
            mentions: [jid],
          });
        }
      }
    } catch (_) {}
  });

  return sock;
}

startBot();

// ─── KEEP-ALIVE: prevent Render free-plan sleep (code 408 fix) ───────────────
// Render spins down free web services after ~15 min of inactivity.
// This pings the bot's own URL every 10 minutes so it stays awake.
const https = require("https");
const http  = require("http");

function keepAlive() {
  const appUrl = process.env.RENDER_EXTERNAL_URL || process.env.APP_URL;
  if (!appUrl) return; // skip if no URL is set (local dev)

  const url   = new URL(appUrl);
  const proto = url.protocol === "https:" ? https : http;

  proto.get(appUrl, (res) => {
    console.log("[ZIM XMD] Keep-alive ping →", res.statusCode);
  }).on("error", (err) => {
    console.log("[ZIM XMD] Keep-alive ping failed:", err.message);
  });
}

// Ping every 10 minutes (600 000 ms)
setInterval(keepAlive, 10 * 60 * 1000);
