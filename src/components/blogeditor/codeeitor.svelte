<script lang="ts">
    import { Carta, MarkdownEditor, type Plugin } from "carta-md";
    import {
        constructPayload,
        currentEdit,
        getRandomPastelColor,
        imageElement,
        imgInput,
        pb,
        showImage,
        type currentData,
        mapping
    } from "./stores";
    import { math } from "@cartamd/plugin-math";
    import Preview from "./preview.svelte";
    import "@cartamd/plugin-code/default.css";
    import "./editor.css";
    import "katex/dist/katex.css";
    import rehypeMermaid from "rehype-mermaid";
    import rehypePrettyCode from "rehype-pretty-code";
    import { transformerCopyButton } from "@rehype-pretty/transformers";
    import rehypeColoredWords from "./textunderline.svelte.ts";
    import { onMount } from "svelte";
    import TagPicker from "./tagpicker.svelte";
    import rehypeRaw from "rehype-raw";
    import { ifembedTransformer } from "./htmlToIframe";
    
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

    const rawhtml: Plugin = {
        transformers: [
            {
                execution: "async",
                type: "rehype",
                transform({ processor }) {
                    processor.use(rehypeRaw);
                },
            },
        ],
    };


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
        console.log($mapping);
        carta = new Carta({
            sanitizer: false,
            theme: "catppuccin-mocha",
            extensions: [
                ifembedTransformer,
                rawhtml,
                mermaid,
                pretty,
                math(),
                {
                    transformers: [
                        {
                            execution: "async",
                            type: "rehype",
                            transform({ processor }) {
                                processor.use(rehypeColoredWords, $mapping);
                            },
                        },
                    ],
                },
            ],
            rehypeOptions: {
                allowDangerousHtml: true,
                passThrough: ["root", "html"],
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

    function newPost() {
        $showImage = false;
        let current: currentData = {
            id: null,
            isPost: true,
            isEditing: false,
            title: "Title Here!",
            tags: [],
            projectTag: null,
            markdown: "# Put Some MD Here!",
            html: "<h1>Put Some MD Here!</h1>",
            thumbnail: "/blog-placeholder-3.jpg",
            color: "#582859",
        };
        $currentEdit = current;
    }

    function newProject() {
        $showImage = false;
        let current: currentData = {
            id: null,
            isPost: false,
            isEditing: false,
            title: "ProjectTitle Here!",
            tags: [],
            projectTag: [],
            markdown: "# Good job now time to write!",
            html: "<h1>Good job now time to write!</h1>",
            thumbnail: "/blog-placeholder-4.jpg",
            color: getRandomPastelColor(),
        };
        $currentEdit = current;
    }

    async function push() {
        newhtml();
        let data = $currentEdit;
        let payload = constructPayload($currentEdit);
        console.log(payload);
        if (data.isPost) {
            if (data.isEditing) {
                // edit post
                if (data.id == null) {
                    throw new Error("ID is null");
                }
                const updateRecord = await pb
                    .collection("Posts")
                    .update(data.id, payload);
                console.log(updateRecord);
            } else {
                // create post
                console.log(payload.tagName);
                const createRecord = await pb
                    .collection("Posts")
                    .create(payload);

                console.log(createRecord);
                $currentEdit.id = createRecord.id;
                $currentEdit.isEditing = true;

            }
        } else if (data.isPost == false) {
            if (data.isEditing) {
                // edit project
                if (data.id == null) {
                    throw new Error("ID is null");
                }
                const updateRecord = await pb
                    .collection("Projects")
                    .update(data.id, payload);
                console.log(updateRecord);
            } else {
                // create project
                console.log(payload.tagName);
                const createRecord = await pb
                    .collection("Projects")
                    .create(payload);
                console.log(createRecord);
                $currentEdit.id = createRecord.id;
                $currentEdit.isEditing = true;
            }
        }
    }
    $inspect(JSON.stringify($currentEdit, null, 2));
    async function newImage() {
        const file = $imgInput.files[0];
        if (file) {
            $currentEdit.thumbnail = $imgInput.files[0];
            $showImage = true;
            const reader = new FileReader();
            $currentEdit.color = getRandomPastelColor();
            // listener first
            reader.addEventListener("load", function () {
                $imageElement = reader.result;
            });
            // then do the loading
            reader.readAsDataURL(file);
            return;
        } else {
            $showImage = false;
        }
    }
</script>

{#if carta != null}
    <div class="editor-actions">
        <button class="pill solid" onclick={push}>update / upload ↑</button>
        <button class="pill" onclick={newhtml}>generate preview</button>
        <span class="spacer"></span>
        <button class="pill" onclick={newPost}>+ new post</button>
        <button class="pill" onclick={newProject}>+ new project</button>
    </div>

    <MarkdownEditor {carta} bind:value={$currentEdit.markdown} mode="tabs" />

    <section class="options" aria-label="Options">
        <h2 class="display-title">Options</h2>
        <div class="option-grid">
            <!-- Pick a Title -->
            <div class="option">
                <span class="option-label">title</span>
                <input type="text" bind:value={$currentEdit.title} />
                <button class="option-btn" onclick={() => {$currentEdit.title = "Title Here!"}}>reset</button>
            </div>
            <!-- thumbnail upload function -->
            <div class="option">
                <span class="option-label">thumbnail</span>
                <input type="file" bind:this={$imgInput} onchange={newImage} />
            </div>
            <!-- Color Picker -->
            <div class="option">
                <span class="option-label">color</span>
                <input type="text" bind:value={$currentEdit.color} style="border-color: {$currentEdit.color}" />
                <button class="option-btn" style="color: {$currentEdit.color}" onclick={() => {$currentEdit.color = getRandomPastelColor()}}>random</button>
            </div>
            <!-- Tag Picker -->
            <div class="option option-wide">
                <TagPicker />
            </div>
        </div>
    </section>

    <Preview />
{:else}
    <div class="editor-actions">
        <button class="pill" onclick={newPost}>+ new post</button>
        <button class="pill" onclick={newProject}>+ new project</button>
    </div>
{/if}

<style>
    .editor-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
        margin-bottom: 1.5rem;
    }

    .editor-actions .spacer {
        flex: 1;
    }

    .editor-actions button {
        cursor: pointer;
    }

    .options {
        margin: 3rem 0 5rem;
    }

    .options h2 {
        margin-bottom: 1.5rem;
        font-size: clamp(2.6rem, 6vw, 4rem);
    }

    .option-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 1rem;
    }

    .option {
        display: grid;
        gap: 0.6rem;
        align-content: start;
        padding: 1.1rem;
        border: 1px solid var(--line);
        border-radius: 16px;
        background: var(--ink-raised);
    }

    .option-wide {
        grid-column: 1 / -1;
    }

    .option-label {
        color: var(--muted);
        font-family: var(--font-mono);
        font-size: 0.75rem;
    }

    .option input {
        padding: 0.65rem 0.8rem;
        border: 1px solid var(--line-bright);
        border-radius: 10px;
        color: var(--paper);
        background: var(--ink);
        font: inherit;
        outline: none;
    }

    .option input:focus {
        border-color: var(--accent);
    }

    .option-btn {
        justify-self: start;
        padding: 0.4rem 0.8rem;
        border: 1px solid var(--line-bright);
        border-radius: 999px;
        color: var(--muted-bright);
        background: transparent;
        font-family: var(--font-mono);
        font-size: 0.75rem;
    }

    .option-btn:hover {
        border-color: var(--accent);
    }
</style>
