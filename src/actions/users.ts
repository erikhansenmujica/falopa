import { db } from "@vercel/postgres";
import { User } from "@/lib/definitions";

export const GetAllUsers = async () => {
    const client = await db.connect();
    try {
      const users = await client.sql<User>`SELECT * FROM users`;
      return users.rows;
    } catch (error) {
      console.error(error);
    }
  };

 