let handler = m => m
import moment from 'moment-timezone'

let connectionNotified = false
let lock = false // 🛑 Lock to prevent race condition

handler.before = async function (m) {
  if (connectionNotified || lock) return // 🚫 If already done or in progress, exit

  lock = true // 🧷 Lock it right away to prevent overlaps

  try {
    const setting = global.db.data.settings[this.user.jid] || {}
    const alertJid = '254743706010@s.whatsapp.net'
    const currentTime = moment.tz('Africa/Nairobi').format('dddd, D. MMMM YYYY - HH:mm')

    const botInfo = {
      name: this.user.name || 'SilvaBot',
      jid: this.user.jid,
      prefix: setting.prefix || '.',
      mode: setting.self ? 'PRIVAT 🔒' : 'ÖFFENTLICH 🌍',
    }

    const message = `
🎉 *SILVA MD IST ONLINE!*

🕘 *Zeit:* ${currentTime}
👤 *Bot Name:* ${botInfo.name}
🆔 *JID:* ${botInfo.jid}
🌐 *Modus:* ${botInfo.mode}
💡 *Präfix:* ${botInfo.prefix}

✅ _Silva MD Bot erfolgreich verbunden!_
`.trim()

    // 🎧 Senden Sie eine Audio-Willkommensnachricht
    const audioUrl = 'https://github.com/SilvaTechB/silva-md-bot/raw/main/media/money.mp3'
    await this.sendMessage(alertJid, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      ptt: true,
    }).catch(console.error)

    // 📩 Senden Sie die Hauptnachricht
    await this.sendMessage(alertJid, {
      text: message,
      contextInfo: {
        mentionedJid: [alertJid],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363200367779016@newsletter',
          newsletterName: 'SILVA CONNECTION ⚙️🚀',
          serverMessageId: 143,
        },
      },
    }).catch(console.error)

    // 📝 Status aktualisieren
    await this.updateProfileStatus(`🤖 Silva MD Bot | Verbunden: ${currentTime}`).catch(console.error)

    // ⏱️ Uptime-Bericht
    const uptime = process.uptime()
    const formatUptime = (sec) => {
      const h = Math.floor(sec / 3600)
      const m = Math.floor((sec % 3600) / 60)
      const s = Math.floor(sec % 60)
      return `${h}h ${m}m ${s}s`
    }

    await this.sendMessage(alertJid, {
      text: `🔋◢◤ Silva Md Bot ◢◤\n*Uptime:* ${formatUptime(uptime)}\n📡 *Läuft reibungslos...*\n✨ Silva Tech Inc.`,
    }).catch(console.error)

    connectionNotified = true // ✅ Erledigt!
  } catch (err) {
    console.error('Fehler beim Startalert:', err)
  } finally {
    lock = false // 🔓 Sperre freigeben, falls erforderlich
  }
}

export default handler