import { sql } from "@vercel/postgres";
import { Caca } from "@/lib/definitions";

export const GetAllCacas = async () => {
  try {
    const caca = await sql<Caca>`SELECT * FROM cacas`;
    return caca.rows;
  } catch (error) {
    console.error(error);
  }
};

export const GetAllCacasFromUser = async (name: string) => {
  try {
    const caca =
      await sql<Caca>`SELECT * FROM cacas WHERE cacas.userId = ${name}`;
    return caca.rows;
  } catch (error) {
    console.error(error);
  }
};
