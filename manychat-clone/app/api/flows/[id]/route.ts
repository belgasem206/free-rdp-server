import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();
const WORKSPACE_ID = "seed-ws";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(_: Request, context: any) {
  const { id } = context.params || {};
  const flow = await prisma.flow.findFirst({ where: { id, workspaceId: WORKSPACE_ID } });
  if (!flow) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(flow);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: Request, context: any) {
  const body = await req.json();
  const { name, diagram } = body ?? {};
  const { id } = context.params || {};
  const flow = await prisma.flow.update({ where: { id }, data: { name, diagram } });
  return NextResponse.json(flow);
}
