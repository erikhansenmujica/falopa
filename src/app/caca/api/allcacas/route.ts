import { GetAllCacas } from "@/actions/cacas";
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
  const cacas = await GetAllCacas();
  if (cacas) {
    return NextResponse.json(cacas, { status: 200 });
  }
  return NextResponse.json([], { status: 200 });
};
