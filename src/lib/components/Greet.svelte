<script lang="ts">
    import { Button } from "./ui/button";
    import { Input } from "./ui/input";
    import { commands } from "@/bindings";
    import { store } from "@/store.svelte";

    let name = $state("");
    let greetMsg = $state("");

    async function greet() {
        greetMsg = await commands.greet(name);
    }

    function keypress(event: KeyboardEvent) {
        if (event.key === "Enter") greet();
    }

    async function greetFromStore() {
        await commands.greetFromStore();
    }

    function keypressStore(event: KeyboardEvent) {
        if (event.key === "Enter") greetFromStore();
    }
</script>

<div class="col">
    <div class="row">
        <Input
            id="greet-input"
            placeholder="Enter a name..."
            onkeypress={keypress}
            bind:value={name}
        />
        <Button onclick={greet}>Greet</Button>
    </div>
    <p class="mt-2">
        {greetMsg}
    </p>
    <!-- use store for the messages as an example for a store-->
    <div class="row mt-4">
        <Input
            id="greet-input-store"
            placeholder="Enter a name..."
            onkeypress={keypressStore}
            bind:value={store.state.name}
        />
        <Button onclick={greetFromStore}>Greet from store</Button>
    </div>
    <p class="mt-2">
        {store.state.greetMsg}
    </p>
</div>
