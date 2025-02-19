<script lang="ts">
  import DarkMode from "@/components/DarkMode.svelte";
  import Greet from "@/components/Greet.svelte";
  import { store } from "@/store.svelte";
  import { ModeWatcher } from "mode-watcher";
  import { onMount } from "svelte";

  onMount(() => {
    store.start();
  });
</script>

<ModeWatcher />
<div class="h-full">
  <main class="container h-full">
    <DarkMode class="absolute right-3 top-3" />
    <div class="w-full h-full flex items-center">
      <Greet />
    </div>
  </main>
</div>
