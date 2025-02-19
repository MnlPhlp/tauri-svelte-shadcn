<script lang="ts">
    import { Button } from "./ui/button";
    import { Input } from "./ui/input";
    import { commands } from "@/bindings";

    let name = $state("");
    let greetMsg = $state("");

    async function greet() {
        greetMsg = await commands.greet(name);
    }

    function keypress(event: KeyboardEvent) {
        if (event.key === "Enter") greet();
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
</div>
