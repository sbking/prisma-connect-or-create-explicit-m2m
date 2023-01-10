# Prisma `connectOrCreate` with an explicit many-to-many relation

This example shows how to use Prisma's nested write APIs to create related rows with an [explicit many-to-many relation](https://www.prisma.io/docs/concepts/components/prisma-schema/relations/many-to-many-relations#explicit-many-to-many-relations).

The database schema has a `Post` model, a `Tag` model, and an explicit `PostTag` model which represents the many-to-many relation between `Post` and `Tag`. In the script, when a post is created, a random set of tags are also added to the post. These tags may or may not exist yet.

This works by using a combination of the [nested `create` API](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#create-a-single-record-and-multiple-related-records) to create `PostTag`s and the [nested `connectOrCreate` API](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#connect-or-create-a-record) to create `Tag`s:

```typescript
await prisma.post.create({
  data: {
    title: "My New Post",
    tags: {
      // Create new PostTags (join table)
      create: ["foo", "bar", "baz"].map((name) => ({
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
```

## How to use

### Prerequisites

- Install [Node.js](https://nodejs.org/en/download/)

### 1. Download example & install dependencies

Clone this repository:

```sh
git clone git@github.com:sbking/prisma-connect-or-create-explicit-m2m.git
```

Install dependencies:

```sh
npm install
```

### 2. Create an SQLite database and run migrations

Run the following command. An SQLite database will be created automatically:

```sh
npx prisma migrate dev --name init
```

### 3. Run the `dev` script

To run the `script.ts` file, run the following command:

```sh
npm run dev
```
