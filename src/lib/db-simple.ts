// This helper previously created a MongoClient connection. The project has
// been migrated to Supabase for data storage; if you still need direct
// MongoDB access, re-add the `mongodb` package and implement accordingly.
export async function connectDB() {
  throw new Error('connectDB (Mongo) is not available. Use Supabase client via src/lib/mongodb.ts')
}