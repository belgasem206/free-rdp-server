import { NextResponse } from "next/server";
import { PrismaClient, FlowNodeType, MessageRole, Channel } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const workspace = await prisma.workspace.upsert({
      where: { id: "seed-ws" },
      update: {},
      create: { id: "seed-ws", name: "Demo Workspace" },
    });

    const user = await prisma.user.upsert({
      where: { email: "owner@example.com" },
      update: {},
      create: { email: "owner@example.com", name: "Owner", workspaceId: workspace.id },
    });

    const contact = await prisma.contact.upsert({
      where: { id: "seed-contact" },
      update: {},
      create: {
        id: "seed-contact",
        workspaceId: workspace.id,
        name: "Ahmed",
        phone: "+201000000000",
        channel: Channel.WEB,
        locale: "ar",
      },
    });

    const flow = await prisma.flow.upsert({
      where: { id: "seed-flow" },
      update: { published: true },
      create: {
        id: "seed-flow",
        workspaceId: workspace.id,
        name: "Welcome Flow",
        description: "Simple greeting and question",
        published: true,
        diagram: {
          nodes: [
            { id: "start", type: "input", position: { x: 0, y: 0 }, data: { label: "Start" } },
            { id: "n1", type: "default", position: { x: 200, y: 0 }, data: { text: "مرحبا! كيف أستطيع مساعدتك؟" } },
          ],
          edges: [
            { id: "e1", source: "start", target: "n1", label: "start" },
          ],
        },
      },
    });

    const startNode = await prisma.flowNode.upsert({
      where: { id: "seed-start-node" },
      update: {},
      create: {
        id: "seed-start-node",
        flowId: flow.id,
        type: FlowNodeType.START,
        data: { label: "Start" },
        positionX: 0,
        positionY: 0,
      },
    });

    const messageNode = await prisma.flowNode.upsert({
      where: { id: "seed-message-node" },
      update: {},
      create: {
        id: "seed-message-node",
        flowId: flow.id,
        type: FlowNodeType.MESSAGE,
        data: { text: "مرحبا! كيف أستطيع مساعدتك؟" },
        positionX: 200,
        positionY: 0,
      },
    });

    await prisma.flowEdge.upsert({
      where: { id: "seed-edge" },
      update: {},
      create: {
        id: "seed-edge",
        flowId: flow.id,
        sourceNodeId: startNode.id,
        targetNodeId: messageNode.id,
        label: "start",
      },
    });

    await prisma.conversation.upsert({
      where: { id: "seed-conv" },
      update: {},
      create: {
        id: "seed-conv",
        workspaceId: workspace.id,
        contactId: contact.id,
        messages: {
          create: [
            { role: MessageRole.BOT, content: "مرحبا! كيف أستطيع مساعدتك؟" },
            { role: MessageRole.CONTACT, content: "أريد معلومات عن الخطة" },
            { role: MessageRole.BOT, content: "لدينا خطة مجانية وخطة برو" },
          ],
        },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "seed failed" }, { status: 500 });
  }
}
