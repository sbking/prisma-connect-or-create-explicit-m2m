import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

/** A bank of 20 possible tag names */
const TAG_NAMES = faker.helpers.uniqueArray(faker.hacker.noun, 20);

async function main() {
  // Delete existing data
  await prisma.post.deleteMany({});
  await prisma.tag.deleteMany({});

  // Create 100 posts
  for (let i = 0; i < 100; i++) {
    // Add 2 to 10 random tags to each post
    const postTags = faker.helpers.arrayElements(
      TAG_NAMES,
      faker.datatype.number({ min: 2, max: 10 })
    );

    await prisma.post.create({
      data: {
        title: faker.hacker.phrase(),
        tags: {
          // Create new PostTags (join table)
          create: postTags.map((name) => ({
            tag: {
              // Connect or create a Tag
              connectOrCreate: {
                where: { name },
                create: { name },
              },
            },
          })),
        },
      },
    });
  }

  // List some of the posts
  for (const post of await prisma.post.findMany({
    take: 10,
    include: { tags: { include: { tag: true } } },
  })) {
    console.log("------------------");
    console.log(`Post: ${post.title}`);
    console.log(`Tags: ${post.tags.map((tag) => tag.tag.name).join(", ")}`);
    console.log("------------------\n");
  }
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
