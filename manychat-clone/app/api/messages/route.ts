import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, MessageRole } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  const conversations = await prisma.conversation.findMany({
    include: { messages: { orderBy: { sentAt: "asc" } }, contact: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(conversations);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { conversationId, content } = body ?? {};
  if (!conversationId || !content) {
    return NextResponse.json({ error: "conversationId and content required" }, { status: 400 });
  }
  const msg = await prisma.message.create({
    data: { conversationId, role: MessageRole.BOT, content },
  });
  return NextResponse.json(msg, { status: 201 });
}
