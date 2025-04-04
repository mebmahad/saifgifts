const conf = {
appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
appwriteCollectionproducts: String(import.meta.env.VITE_APPWRITE_COLLECTION_PRODUCTS),
appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
appwriteCollectionusers: String(import.meta.env.VITE_APPWRITE_COLLECTION_USERS),
}
export default conf;