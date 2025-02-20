import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

console.log(import.meta.env)
if (import.meta.env.DEV && !window.__TAURI__) {
  console.log('http mode');
  (await import('./lib/debug')).setup();
}

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
