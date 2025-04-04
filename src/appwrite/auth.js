import conf from '../conf/conf';
import {Client, Account, ID, Databases, Query} from 'appwrite';

export class AuthService {
    client = new Client();
    account;
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
        this.databases = new Databases(this.client);
    }

    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if(userAccount) {
                // Create user document with role
                await this.databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionusers,
                    userAccount.$id,
                    {
                        userId: userAccount.$id,
                        email,
                        name,
                        role: 'user' // Default role
                    }
                );
                return this.login({email, password});
            } else {
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const account = await this.account.get();
            if (account) {
                // Get user role from users collection
                const userData = await this.databases.listDocuments(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionusers,
                    [Query.equal('userId', account.$id)]
                );
                
                if (userData.documents.length > 0) {
                    return {
                        ...account,
                        role: userData.documents[0].role
                    };
                }
                return account;
            }
            return null;
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error);
            return null;
        }
    }

    async login({email, password}) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions(); 
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
        } 
    }
}

const authService = new AuthService();
export default authService;
