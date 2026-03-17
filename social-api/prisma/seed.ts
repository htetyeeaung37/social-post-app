import { prisma } from "../libs/prisma";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

async function main() {
	console.log("User seeding started...");

	await prisma.user.create({
		data: {
			name: "Alice",
			username: "alice",
			bio: "Alice's profile",
			password: await bcrypt.hash("password", 10),
		},
	});

	await prisma.user.create({
		data: {
			name: "Bob",
			username: "bob",
			bio: "Bob's bio",
			password: await bcrypt.hash("password", 10),
		},
	});

	console.log("User seeding done.");

    console.log("Post seeding started...");
	for (let i = 0; i < 20; i++) {
		await prisma.post.create({
			data: {
				content: faker.lorem.paragraph(),
				userId: faker.number.int({ min: 1, max: 2 }),
			},
		});
	}
    console.log("Post seeding done.");

    console.log("Comment seeding started...");
	for (let i = 0; i < 40; i++) {
		await prisma.comment.create({
			data: {
				content: faker.lorem.paragraph(),
				userId: faker.number.int({ min: 1, max: 2 }),
                postId: faker.number.int({ min: 1, max: 20 }),
			},
		});
	}
	console.log("Comment seeding done.");
}

main();
