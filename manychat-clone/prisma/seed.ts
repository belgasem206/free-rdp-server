import { PrismaClient, FlowNodeType, MessageRole, Channel } from "../app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
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

  const contact = await prisma.contact.create({
    data: {
      workspaceId: workspace.id,
      name: "Ahmed",
      phone: "+201000000000",
      channel: Channel.WEB,
      locale: "ar",
    },
  });

  const flow = await prisma.flow.create({
    data: {
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

  const startNode = await prisma.flowNode.create({
    data: {
      flowId: flow.id,
      type: FlowNodeType.START,
      data: { label: "Start" },
      positionX: 0,
      positionY: 0,
    },
  });

  const messageNode = await prisma.flowNode.create({
    data: {
      flowId: flow.id,
      type: FlowNodeType.MESSAGE,
      data: { text: "مرحبا! كيف أستطيع مساعدتك؟" },
      positionX: 200,
      positionY: 0,
    },
  });

  await prisma.flowEdge.create({
    data: {
      flowId: flow.id,
      sourceNodeId: startNode.id,
      targetNodeId: messageNode.id,
      label: "start",
    },
  });

  const conversation = await prisma.conversation.create({
    data: {
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

  console.log({ workspace, user, contact, flowId: flow.id, conversationId: conversation.id });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
