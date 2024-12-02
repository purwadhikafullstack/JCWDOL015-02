import prisma from "@/prisma";

export async function generateUniqueId(): Promise<number> {
    let uniqueId;
    let exists;

    do {
        uniqueId = Math.floor(100000 + Math.random() * 900000);
        exists = await prisma.order.findUnique({ where: { id: uniqueId } });
    } while (exists);

    return uniqueId;
}