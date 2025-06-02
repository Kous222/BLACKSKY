let isAway = false;
let lastSeen = null;

let handler = async (m, { conn, command }) => {
  if (command === "abwesend") {
    if (isAway) return m.reply("🚀 *Away Mode ist bereits aktiviert!*");

    isAway = true;
    lastSeen = Date.now();
    return m.reply("✅ *Away Mode aktiviert!*\n\nIch werde automatisch antworten, bis Sie *aktiv* eingeben.");
  }

  if (command === "aktiv") {
    if (!isAway) return m.reply("✅ *Du bist bereits aktiv!*");

    isAway = false;
    return m.reply("✅ *Away Mode deaktiviert!*\n\nIch bin wieder online.");
  }

  // Wenn Away Mode AN ist, benachrichtigen Sie den Sender
  if (isAway) {
    let now = Date.now();
    let diff = now - lastSeen;

    let seconds = Math.floor(diff / 1000) % 60;
    let minutes = Math.floor(diff / (1000 * 60)) % 60;
    let hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));

    let lastSeenText = `*${days}d ${hours}h ${minutes}m ${seconds}s*`;

    await conn.sendMessage(
      m.chat,
      {
        text: `🤖 *BIP BOP! DAS IST SILVA MD BOT*\n\n🚀 *MEIN BESITZER IST ABWESEND!*\n📅 *Letzte Sichtung:* ${lastSeenText}\n\nIch werde antworten, wenn mein Besitzer zurück ist.`,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363200367779016@newsletter",
            newsletterName: "SILVA IST ABWESEND 🥳",
            serverMessageId: 143,
          },
        },
      },
      { quoted: m }
    );
  }
};

handler.help = ["abwesend", "aktiv"];
handler.tags = ["werkzeuge"];
handler.command = ["abwesend", "aktiv"];

export default handler;