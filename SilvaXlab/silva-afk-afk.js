let handler = async (m, { text, conn }) => {
    let user = global.db.data.users[m.sender]
    if (text.length >= 90) throw `✳️ ${mssg.afktemx}`
    user.afk = + new Date
    user.afkReason = text
    m.reply(`
≡ *${mssg.afkdone}*

▢ *${mssg.name}:* ${conn.getName(m.sender)}
▢ *${mssg.with}:* ${text ? text : ''}

_${mssg.afkmsg}_
  `, null, { mentions: conn.parseMention(text) })
}
handler.help = ['abwesend']
handler.tags = ['spaß']
handler.command = ['abwesend']
handler.group = false

export default handler