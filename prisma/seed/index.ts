import { userSeeder } from "./userSeeder";

async function main() {
    console.log("🌱 Seeding database…");
    const { admin, regular } = await userSeeder();
    console.log("🎉 Seed complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })