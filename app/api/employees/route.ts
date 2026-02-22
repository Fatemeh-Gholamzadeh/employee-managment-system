import { NextRequest } from "next/server";
import {
  GETEmployyes,
  POSTEmployye,
  PUTEmployye,
  DELETEEmployye,
} from "@/apis/employee";

export async function GET() {
  return GETEmployyes();
}

export async function POST(req: NextRequest) {
  return POSTEmployye(req);
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return new Response("ID is required", { status: 400 });
  return PUTEmployye(req, { params: { id } });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return new Response("ID is required", { status: 400 });
  return DELETEEmployye(req, { params: { id } });
}
