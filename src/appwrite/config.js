import conf from '../conf/conf';
import {Client, ID, Databases, Storage, Query} from 'appwrite';

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }
    async createProduct({name, id, shortdescription, purchaserate,
        featuredimage, longdescription, salerate, quantity, images}) {
        try {
          return await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionproducts,
            id,
            {
                name,
                shortdescription,
                purchaserate,
                featuredimage,
                longdescription,
                salerate,
                quantity,
                images,
            }
          )  
        }
        catch(error) {
            console.log("Appwrite service :: createProduct :: error", error); 
        }
        
    }

    async updateProduct(id,{name, shortdescription, purchaserate,
        featuredimage, longdescription, salerate, quantity, images}) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionproducts,
                id,
                {
                    name,
                    shortdescription,
                    purchaserate,
                    featuredimage,
                    longdescription,
                    salerate,
                    quantity,
                    images,
                }
            )
        } catch (error) {
            console.log("Appwrite service :: updateProduct :: error", error);
        }
    }

    async deleteProduct(id) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionproducts,
                id
            ) 
            return true;
        } 
        catch(error) {
            console.log("Appwrite service :: deleteProduct :: error", error); 
            return false;
        }
    }

    async getProduct(id) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionproducts,
                id
            )
        } catch (error) {
            console.log("Appwrite service :: getProduct :: error", error);
            return false;
        }
    }

    async getProducts(queries = []) {  // Remove the default filter
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionproducts,
                queries
            ) 
        }
        catch(error) {
            console.log("Appwrite service :: getProducts :: error", error);
            return false;
        }     
    }

    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true;  
        } 
        catch(error) {
            console.log("Appwrite service :: deleteFile :: error", error);
            return false;
        }
    }

    getFilePreview(fileId) {
        try {
            if (!fileId) return null;
            const url = this.bucket.getFileView(  // Changed to getFileView
                conf.appwriteBucketId,
                fileId,
                400,  // width
                300   // height
            );
            return url.toString();  // Convert URL object to string
        } catch (error) {
            console.log("Appwrite service :: getFilePreview :: error", error);
            return null;
        }
        }

        async uploadMultipleFiles(files) {
            try {
                const uploadPromises = files.map(file => 
                    this.bucket.createFile(
                        conf.appwriteBucketId,
                        ID.unique(),
                        file
                    )
                );
                const results = await Promise.all(uploadPromises);
                return results.map(file => file.$id);
            } catch (error) {
                console.error("Appwrite service :: uploadMultipleFiles :: error", error);
                return [];
            }
        }

    getMultipleFilesPreviews(fileIds) {
        try {
            if (!fileIds || !Array.isArray(fileIds)) return [];
            return fileIds.map(fileId => {
                if (!fileId) return null;
                return this.bucket.getFileView(
                    conf.appwriteBucketId,
                    fileId,
                    400,  // width
                    300   // height
                );
            }).filter(url => url !== null);
        } catch (error) {
            console.log("Appwrite service :: getMultipleFilesPreviews :: error", error);
            return [];
        }
    }
}

const service = new Service()
export default service;