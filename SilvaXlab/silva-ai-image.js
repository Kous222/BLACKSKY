import FormData from "form-data";
import Jimp from "jimp";

async function processing(urlPath, method) {
	return new Promise(async (resolve, reject) => {
		let Methods = ["verbessern", "farbfüllen", "entnebeln"];
		Methods.includes(method) ? (method = method) : (method = Methods[0]);
		let buffer,
			Form = new FormData(),
			scheme = "https" + "://" + "inferenceengine" + ".vyro" + ".ai/" + method;
		Form.append("model_version", 1, {
			"Content-Transfer-Encoding": "binary",
			contentType: "multipart/form-data; charset=uttf-8",
		});
		Form.append("image", Buffer.from(urlPath), {
			filename: "verbessertes_bild_body.jpg",
			contentType: "image/jpeg",
		});
		Form.submit(
			{
				url: scheme,
				host: "inferenceengine" + ".vyro" + ".ai",
				path: "/" + method,
				protocol: "https:",
				headers: {
					"User-Agent": "okhttp/4.9.3",
					Connection: "Keep-Alive",
					"Accept-Encoding": "gzip",
				},
			},
			function (err, res) {
				if (err) reject();
				let data = [];
				res
					.on("data", function (chunk, resp) {
						data.push(chunk);
					})
					.on("end", () => {
						resolve(Buffer.concat(data));
					});
				res.on("error", (e) => {
					reject();
				});
			}
		);
	});
}
let handler = async (m, { conn, usedPrefix, command }) => {
	switch (command) {
		case "verbesseren":
		case "unschärfenentfernen":
		case "verbessern":
			{
				conn.verbesseren = conn.verbesseren ? conn.verbesseren : {};
				if (m.sender in conn.verbesseren)
					throw "Warten Sie, bis ein Bild verarbeitet wurde.";
				let q = m.quoted ? m.quoted : m;
				let mime = (q.msg || q).mimetype || q.mediaType || "";
				if (!mime)
					throw `Geben Sie den Befehl zusammen mit dem Bild ein`;
				if (!/image\/(jpe?g|png)/.test(mime))
					throw ` ${mime} wird nicht unterstützt`;
				else conn.verbesseren[m.sender] = true;
				m.reply('Warten Sie bitte...');
				let img = await q.download?.();
				let error;
				try {
					const This = await processing(img, "verbessern");
					conn.sendFile(m.chat, This, "shizo.img", maker, m);
				} catch (er) {
					error = true;
				} finally {
					if (error) {
						m.reply("Verbindung zum Server unterbrochen");
					}
					delete conn.verbesseren[m.sender];
				}
			}
			break;
		case "farbfüllen":
		case "farbfüller":
			{
				conn.farbfüllen = conn.farbfüllen ? conn.farbfüllen : {};
				if (m.sender in conn.farbfüllen)
					throw "Warten Sie, bis ein Bild verarbeitet wurde";
				let q = m.quoted ? m.quoted : m;
				let mime = (q.msg || q).mimetype || q.mediaType || "";
				if (!mime)
					throw `Geben Sie den Befehl zusammen mit Bild ein`;
				if (!/image\/(jpe?g|png)/.test(mime))
					throw `${mime} ist nicht bearbeitbar`;
				else conn.farbfüllen[m.sender] = true;
				m.reply('Warten Sie bitte...');
				let img = await q.download?.();
				let error;
				try {
					const This = await processing(img, "farbfüllen");
					conn.sendFile(m.chat, This, "shizo.img", maker, m);
				} catch (er) {
					error = true;
				} finally {
					if (error) {
						m.reply("Verbindung zum Server unterbrochen");
					}
					delete conn.farbfüllen[m.chat];
				}
			}
			break;
		case "hd":
		case "hdr":
			{
				conn.hdr = conn.hdr ? conn.hdr : {};
				if (m.sender in conn.hdr)
					throw "Warten Sie, bis ein Bild verarbeitet wurde, dann fügen Sie ein anderes hinzu";
				let q = m.quoted ? m.quoted : m;
				let mime = (q.msg || q).mimetype || q.mediaType || "";
				if (!mime)
					throw `Geben Sie den Befehl zusammen mit Bild ein`;
				if (!/image\/(jpe?g|png)/.test(mime))
					throw `${mime} ist nicht bearbeitbar`;
				else conn.hdr[m.sender] = true;
				m.reply('Warten Sie bitte...');
				let img = await q.download?.();
				let error;
				try {
					const This = await processing(img, "verbessern");
					conn.sendFile(m.chat, This, "shizo.img", maker, m);
				} catch (er) {
					error = true;
				} finally {
					if (error) {
						m.reply("Verbindung zum Server unterbrochen");
					}
					delete conn.hdr[m.sender];
				}
			}
			break;
	}
};
handler.help = ['hd', 'hdr', 'unschärfenentfernen', 'unschärfebeseitigen', 'farbfüllen', 'farbfüller', 'verbessern', 'verbesserer','entnebeln','farbfüllen' ,'verbessern']
handler.tags = ["bild", "ersteller"];
handler.command = ['hd', 'hdr', 'unschärfenentfernen', 'unschärfebeseitigen', 'farbfüllen', 'farbfüller', 'verbessern', 'verbesserer','entnebeln','farbfüllen' ,'verbessern']
export default handler;