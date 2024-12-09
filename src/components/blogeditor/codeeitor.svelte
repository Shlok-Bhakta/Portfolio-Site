<script lang="ts">
	import { Carta, MarkdownEditor } from 'carta-md';
    import { currentEdit } from './stores';
	import './editor.css';
    import Preview from "./preview.svelte";
    import '@cartamd/plugin-code/default.css';
    import 'katex/dist/katex.css';
    import { code } from '@cartamd/plugin-code';    
    import { math } from '@cartamd/plugin-math';

    const carta = new Carta({
        sanitizer: false,
        theme: 'catppuccin-mocha',
        extensions: [
            code(), math()
        ],
        rehypeOptions: {
            allowDangerousHtml: true,
            passThrough: ['root'],
        },

    });
    async function newhtml() {
        $currentEdit.html = await carta.render($currentEdit.markdown);
    }

    // const transformer = new UnifiedTransformer({
    //     execution: 'sync',
    //     type: ''
    // });

</script>
<MarkdownEditor {carta} bind:value={$currentEdit.markdown} mode="tabs" />
<button class="text-3xl text-text text-center w-full" onclick={newhtml}>Final Preview!</button>
<Preview />

<!-- <div bind:this={container}></div> -->