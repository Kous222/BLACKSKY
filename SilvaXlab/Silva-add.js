// Add Member Command Script for Silva MD Bot
// This Skript ermöglicht es Gruppenadministratoren, Mitglieder mit dem Befehlsformat hinzuzufügen: add 254700143167

let handler = async (m, { conn, args }) => {
  try {
    // Stellen Sie sicher, dass der Befehl in einer Gruppe verwendet wird
    if (!m.isGroup) throw 'Dieser Befehl kann nur in Gruppenchats verwendet werden.';

    // Abrufen der Gruppenmetadaten
    const groupMetadata = await conn.groupMetadata(m.chat);
    const participants = groupMetadata.participants;

    // Überprüfen Sie, ob der Bot ein Admin ist
    const botAdmin = participants.find(p => p.id === conn.user.jid && p.admin);
    if (!botAdmin) throw 'Ich muss ein Admin sein, um Mitglieder hinzuzufügen!';

    // Überprüfen Sie, ob der Absender ein Admin ist
    const senderAdmin = participants.find(p => p.id === m.sender && p.admin);
    if (!senderAdmin) throw 'Nur Gruppenadmins können diesen Befehl verwenden!';

    // Stellen Sie sicher, dass eine Telefonnummer angegeben ist
    if (!args[0]) throw 'Bitte geben Sie eine Telefonnummer an, die hinzugefügt werden soll.';
    let target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';

    // Überprüfen Sie, ob der Benutzer bereits in der Gruppe ist
    if (participants.find(p => p.id === target)) {
      throw 'Der Benutzer ist bereits in dieser Gruppe.';
    }

    // Versuchen Sie, den Teilnehmer hinzuzufügen
    await conn.groupParticipantsUpdate(m.chat, [target], 'add');
    m.reply(`Silva MD Bot: @${target.split('@')[0]} wurde erfolgreich hinzugefügt.`, null, { mentions: [target] });

  } catch (e) {
    console.error(e);
    m.reply(`Fehler: ${e.message || e}`);
  }
};

handler.help = ['add <Telefonnummer>'];
handler.tags = ['gruppe'];
handler.command = /^add$/i;

handler.group = true; // Auf Gruppenchats beschränken
handler.admin = true; // Benutzer muss ein Admin sein, um diesen Befehl zu verwenden
handler.botAdmin = true; // Der Bot muss ein Admin sein, um diesen Befehl auszuführen

export default handler;