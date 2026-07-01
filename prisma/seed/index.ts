import { userSeeder } from "./userSeeder";
import { postSeeder } from "./postSeeder";
import {commentSeeder} from "./commentSeeder";

async function main() {
    console.log("🌱 Seeding database…");
    const { admin, regular } = await userSeeder();
    const {post} = await postSeeder(admin);
    await commentSeeder(admin, regular, post);
    console.log("🎉 Seed complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })