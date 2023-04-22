import { Account, Avatars, Client } from 'appwrite';

export const SsrHostname: string = 'qwik.ssr.almostapps.eu';
export const AppwriteHostname: string = 'appwrite.qwik.ssr.almostapps.eu';

export const AppwriteEndpoint = 'https://appwrite.qwik.ssr.almostapps.eu/v1';
export const AppwriteProject = 'almostSsr';

const client = new Client();
client.setEndpoint(AppwriteEndpoint).setProject(AppwriteProject);

const account = new Account(client);
const avatars = new Avatars(client);

export const AppwriteService = {
	signOut: async () => {
		await account.deleteSession('current');
	},
	getAccount: async () => {
		return await account.get<any>();
	},
	getAccountPicture: (name: string) => {
		return avatars.getInitials(name.split("").reverse().join(""), 256, 256).toString();
	}
};
