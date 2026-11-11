import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    'Internet',
    'SVOD',
    'Linux',
    'Shopping',
    'Achat informatique',
    'Dev',
    'Utilitaires',
    'Presses',
    'Astuces',
    'Divers',
  ];

  console.log('Insertion des 10 catégories de favoris...');

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('Catégories créées avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
