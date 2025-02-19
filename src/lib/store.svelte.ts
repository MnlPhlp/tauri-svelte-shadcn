import { RuneStore, type TauriPluginSvelteStoreOptions } from 'tauri-plugin-svelte';

export type Store = {
	name: string;
	greetMsg: string;
}

const initialState: Store = {
	name: '',
	greetMsg: '',
};

const options: TauriPluginSvelteStoreOptions<Store> = {
	saveOnChange: true,
	// auto save is only relevant for crashes, usually the state is saved on window close
	// so we can have a longer interval for saving
	saveInterval: 5000,
	saveStrategy: 'debounce',
	syncInterval: 200,
	syncStrategy: 'debounce',
};

export const store = new RuneStore('store', initialState, options);

