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
    select: {
      id: true,
      url: true,
      able: true,
    },
  });
};

export const addBusiness = async (business) => {
  await prisma.business.createMany({
    data: [...business],
  });
};

export const updateCategory = async (categoryId) => {
  return await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      able: false,
    },
  });
};
