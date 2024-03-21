import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const addCategories = async (categories) => {
  await prisma.category.createMany({
    data: [...categories],
  });
};

export const readCategories = async (limit, offset) => {
  return await prisma.category.findMany({
    skip: offset,
    take: limit,
    where: {
      able: true,
    },
    select: {
      id: true,
      url: true,
      able: true,
    },
  });
};
