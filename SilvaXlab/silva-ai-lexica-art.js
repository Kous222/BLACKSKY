import fetch from 'node-fetch'

let handler = async (m, {
    text,
    command,
    usedPrefix,
    conn
}) => {

    var suggest = `Geben Sie den Befehl zusammen mit der Eingabe ein 🥺`
    if (!text) throw suggest
    try {
        let res = await (await fetch('https://lexica.art/api/v1/search?q=' + text)).json()
        let randm = res.images
        let resul = randm[Math.floor(Math.random() * randm.length)]
        await m.reply('Warten Sie bitte...')
        await conn.sendFile(m.chat,
            resul.src, text, 'Erstellt von Silva MD Bot' + "\n*Kreativität:* " + resul.prompt + '\n\n https://github.com/SilvaTechB/silva-md-bot', m)
    } catch (e) {
        throw e
    }
}

handler.help = ["lexica"]
handler.tags = ['künstliche Intelligenz']
handler.command = ["lexica"]

export default handler