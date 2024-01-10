const { Client, LocalAuth } = require("whatsapp-web.js");

const qrcode = require("qrcode-terminal");
const { db } = require("@vercel/postgres");
const { createCaca } = require("./seed");

const usuarios = {
  5492262616287: "Josi",
  5491123981232: "Euge",
  5492262488887: "Duro",
  5492262301654: "Igna",
  5492262414291: "Ivan",
  5492262609782: "Joaco",
  5492262303948: "Cabe",
  5492216733195: "Juanito",
  5492262416961: "Juli",
  5492262498229: "Lauty",
  5492262484490: "Mate",
  5492262483995: "Sebiche",
  393314495391: "Erik Blando",
  5492262314174: "Iñaki",
  5492262579889: "Tomi",
};

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true },
});

client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  // main();

  console.log("Client is ready!");
});

client.on("message", async (msg) => {
  if (msg.body == "!ping") {
    msg.reply("gorda trola");
  }

  if (msg.body.startsWith("💩")) {
    // Change the group subject
    let chat = await msg.getChat();
    const messages = await chat.fetchMessages({ limit: 90000000 });

    const msgs = messages.filter((m) => m.body.startsWith("💩"));
    console.log(msgs.length);
    const client = await db.connect();

    async function recursive(contador = 0) {
      const m = msgs[contador];

      if (
        m &&
        m._data &&
        m._data.author &&
        m._data.author.user &&
        m._data.author.user in usuarios
      ) {
        const user = usuarios[m._data.author.user];

        console.log(`entre al if y me la re como ${user}`);

        await createCaca(user, new Date(m.timestamp * 1000), client);
      }
      if (contador < msgs.length) {
        return await recursive(contador + 1);
      } else return;
    }

    await recursive();
  }
});

client.initialize();
