<script lang="ts">
    import { Carta, MarkdownEditor, type Plugin } from "carta-md";
    import { currentEdit, pb } from "./stores";
    import { math } from "@cartamd/plugin-math";
    import { code } from "@cartamd/plugin-code";
    import Preview from "./preview.svelte";
    import "@cartamd/plugin-code/default.css";
    import "./editor.css";
    import "katex/dist/katex.css";
    import rehypeMermaid from "rehype-mermaid";
    import rehypePrettyCode from "rehype-pretty-code";
    import { transformerCopyButton } from "@rehype-pretty/transformers";
    import rehypeColoredWords from "./textunderline.svelte";
    import { get } from "svelte/store";
    import { init } from "astro/virtual-modules/prefetch.js";
    import { on } from "svelte/events";
    import { onMount } from "svelte";
    import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

    const mermaid: Plugin = {
        transformers: [
            {
                execution: "async",
                type: "rehype",
                transform({ processor }) {
                    processor.use(rehypeMermaid, {
                        colorScheme: "dark",
                    });
                },
            },
        ],
    };
    const pretty: Plugin = {
        transformers: [
            {
                execution: "async",
                type: "rehype",
                transform({ processor }) {
                    processor.use(rehypePrettyCode, {
                        theme: "catppuccin-mocha",
                        keepBackground: false,
                        transformers: [
                            transformerCopyButton({
                                visibility: "always",
                                feedbackDuration: 3_000,
                            }),
                        ],
                    });
                },
            },
        ],
    };

    let mapping: any = {
        "astro js": ["#111111", "https://example.com"],
        svelte: ["#111111|#ffffff", "https://svelte.dev"],
    };
    async function getMapping() {
        let data = await pb.collection("Mappings").getFullList();
        let result: any = {};
        for (let i = 0; i < data.length; i++) {
            result[data[i].word] = [data[i].color, data[i].link];
        }
        return result;
    }

    $inspect(mapping);
    // // @ts-ignore
    // $effect(async () => {
    //     mapping = await getMapping();
    // });

    // const wordlink: Plugin = {
    //     transformers: [{
    //         execution: 'async',
    //         type: 'rehype',
    //         transform({ processor }) {
    //             processor.use(rehypeColoredWords, mapping);
    //         }
    //     }]
    // };

    // const carta = new Carta({
    //     sanitizer: false,
    //     theme: 'catppuccin-mocha',
    //     extensions: [
    //         mermaid, code(), pretty, math(), wordlink
    //     ],
    //     rehypeOptions: {
    //         allowDangerousHtml: true,
    //         passThrough: ['root'],
    //     },

    // });

    // Main component or setup file
    let carta: any = $state(null);

    async function initializeCarta() {
        const mapping = await getMapping();
        console.log(mapping);
        carta = new Carta({
            sanitizer: false,
            theme: "catppuccin-mocha",
            extensions: [
                mermaid,
                code(),
                pretty,
                math(),
                {
                    transformers: [
                        {
                            execution: "async",
                            type: "rehype",
                            transform({ processor }) {
                                processor.use(rehypeColoredWords, mapping);
                            },
                        },
                    ],
                },
            ],
            rehypeOptions: {
                allowDangerousHtml: true,
                passThrough: ["root"],
            },
        });

        return carta;
    }
    onMount(async () => {
        carta = await initializeCarta();
    });
    async function newhtml() {
        $currentEdit.html = await carta.render($currentEdit.markdown);
    }
</script>

{#if carta != null}
    <MarkdownEditor {carta} bind:value={$currentEdit.markdown} mode="tabs" />
    <button class="text-3xl text-text text-center w-full" onclick={newhtml}
        >Final Preview!</button
    >
    <Preview />
{/if}

<!-- <div bind:this={container}></div> -->
