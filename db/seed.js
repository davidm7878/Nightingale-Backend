import db from "#db/client";
import { createUser } from "#db/queries/users";
import { createHospital } from "#db/queries/hospitals";
import { createPost } from "#db/queries/posts";
import { createReview } from "#db/queries/reviews";
import { createRating } from "#db/queries/ratings";
import { createLike } from "#db/queries/likes";
import { createDislike } from "#db/queries/dislikes";

try {
  await db.connect();
  console.log("Connected to database...");
  await seed();
  await db.end();
  console.log("🌱 Database seeded.");
  process.exit(0);
} catch (error) {
  console.error("Error seeding database:", error);
  try {
    await db.end();
  } catch (e) {
    // Ignore errors when closing
  }
  process.exit(1);
}

async function seed() {
  // Create users
  console.log("Creating users...");
  const user1 = await createUser(
    "john_doe",
    "password123",
    "john@example.com",
    "Experienced RN with 10 years in critical care",
    "https://example.com/resume1.pdf",
  );
  console.log("User 1 created");

  const user2 = await createUser(
    "jane_smith",
    "password456",
    "jane@example.com",
    "Travel nurse specializing in pediatrics",
    "https://example.com/resume2.pdf",
  );
  console.log("User 2 created");

  const user3 = await createUser(
    "mike_wilson",
    "password789",
    "mike@example.com",
    "ER nurse seeking new opportunities",
    null,
  );
  console.log("User 3 created");

  // Create hospitals
  console.log("Creating hospitals...");
  const hospital1 = await createHospital(
    "City General Hospital",
    "123 Main Street",
    "New York",
    "NY",
  );

  const hospital2 = await createHospital(
    "St. Mary's Medical Center",
    "456 Oak Avenue",
    "Los Angeles",
    "CA",
  );

  const hospital3 = await createHospital(
    "County Memorial Hospital",
    "789 Elm Boulevard",
    "Chicago",
    "IL",
  );
  console.log("Hospitals created");

  // Create posts
  console.log("Creating posts...");
  const post1 = await createPost(
    user1.id,
    "Just finished my first week at City General! The team is amazing and the culture is so supportive. #nurselife",
  );

  const post2 = await createPost(
    user2.id,
    "Looking for travel nursing opportunities in California. Any recommendations?",
  );

  const post3 = await createPost(
    user3.id,
    "Does anyone have experience with the ER department at St. Mary's? Considering applying there.",
  );

  const post4 = await createPost(
    user1.id,
    "Pro tip: Always double check your medication dosages before administering. Patient safety first!",
  );
  console.log("Posts created");

  // Create reviews
  console.log("Creating reviews...");
  await createReview(
    user1.id,
    hospital1.id,
    "City General is an excellent place to work. Management is supportive and they provide great continuing education opportunities. The nurse-to-patient ratio is reasonable and the facility is well-maintained.",
  );

  await createReview(
    user2.id,
    hospital2.id,
    "St. Mary's has a great pediatric unit. The staff is friendly and collaborative. However, parking can be a challenge during peak hours.",
  );

  await createReview(
    user3.id,
    hospital1.id,
    "Worked here for 3 years. Good benefits and pay is competitive. The night shift differential is generous.",
  );
  console.log("Reviews created");

  // Create ratings
  console.log("Creating ratings...");
  await createRating(user1.id, hospital1.id, 5);
  await createRating(user2.id, hospital2.id, 4);
  await createRating(user3.id, hospital1.id, 4);
  await createRating(user1.id, hospital2.id, 3);
  await createRating(user2.id, hospital3.id, 4);
  console.log("Ratings created");

  // Create likes
  console.log("Creating likes...");
  await createLike(user2.id, post1.id);
  await createLike(user3.id, post1.id);
  await createLike(user1.id, post2.id);
  await createLike(user3.id, post4.id);
  console.log("Likes created");

  // Create dislikes
  console.log("Creating dislikes...");
  await createDislike(user2.id, post3.id);
  console.log("Dislikes created");
}
