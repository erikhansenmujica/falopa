import { GetAllCacasFromUser } from "@/actions/cacas";
import { GetAllUsers } from "@/actions/users";
import { User } from "@/lib/definitions";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

type ResponseData = {
  users: User[];
};

export const GET = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const users = await GetAllUsers();
  if (users) {
    return NextResponse.json(users, { status: 200 });
  }
  return NextResponse.json([], { status: 200 });
};
