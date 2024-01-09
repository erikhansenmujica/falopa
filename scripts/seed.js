const { db } = require("@vercel/postgres");

async function main() {
  const client = await db.connect();

  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`DROP TABLE IF EXISTS users cascade`;
  await client.sql`DROP TABLE IF EXISTS cacas cascade`;
  await client.sql`CREATE TABLE IF NOT EXISTS users (id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, name text NOT NULL)`;
  await client.sql`CREATE TABLE IF NOT EXISTS cacas (id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, userId text NOT NULL, date timestamp NOT NULL)`;
  // console.log("client", client);
  await createUser();
  await client.end();
}

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

async function createUser() {
  try {
    const client = await db.connect();

    for (const tel in usuarios) {
      const name = usuarios[tel];
      console.log("puto el que lee");
      await client.sql`INSERT INTO users (name) VALUES (${name})`;
    }

    await client.end();
  } catch (e) {
    console.log(e);
  }
}

// createUser();

async function createCaca(userId, date, client) {
  try {
    console.log("entre a la caca");
    await client.sql`INSERT INTO cacas (userId, date) VALUES (${userId},${date})`;
  } catch (e) {
    console.log(e);
  }
}

main().catch((e) => console.error(e));

module.exports = {
  createCaca,
  createUser,
};
