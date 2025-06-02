let handler = async (m, { conn, text }) => {
  if (!text) throw 'Kein Text' // Übersetzte Fehlermeldung
  conn.sendFile(
    m.chat,
    global.API('https://some-random-api.com', '/canvas/misc/youtube-comment', {
      avatar: await conn
        .profilePictureUrl(m.sender, 'image')
        .catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),
      comment: text,
      username: conn.getName(m.sender),
    }),
    'fehler.png', // Geänderter Dateiname
    '*DANKE FÜR DEN KOMMENTAR*', // Übersetzte Nachricht
    m
  )
}

// Befehlshilfe und Tags auf Deutsch
handler.help = ['ytcomment </Kommentar>'] // Übersetzte Hilfetexte
handler.tags = ['erstellen'] // Übersetztes Tag
handler.command = /^(ytcomment)$/i // Befehl bleibt auf Englisch
export default handler