import fetch from "node-fetch"

let handler = async (m, {
    conn,
    isOwner,
    usedPrefix,
    command,
    text,
    args
}) => {
    if (!Number(text)) return m.reply(`Geben Sie den Befehl zusammen mit der gewählten Nummer ein 🥺`)
    await m.reply('Warten Sie bitte...')
    let res = await fetch('https://civitai.com/api/v1/models')
    let jso = await res.json()
    let resu = jso.items[text].modelVersions[0].images[0].meta.prompt
    await m.reply(resu)
}
handler.help = ["civitai", "civit"]
handler.tags = ["künstliche Intelligenz"]
handler.command = /^(civit|civitai)$/i
export default handler