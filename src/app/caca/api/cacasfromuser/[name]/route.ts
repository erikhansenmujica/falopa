import { GetAllCacasFromUser } from "@/actions/cacas";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  { params }: { params: { name: string } }
) => {
  const name = params.name;
  if (typeof name === "string") {
    const cacas = await GetAllCacasFromUser(name);
    if (cacas) {
      return NextResponse.json({ name, cacas });
    }
    return NextResponse.json([]);
  }
  return NextResponse.json([]);
};
