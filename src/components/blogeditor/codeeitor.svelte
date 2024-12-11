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
            } else {
                // create project
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

<button class="w-full rounded-md bg-overlay2 hover:bg-green" onclick={newPost}
    >New Post</button
>
{#if carta != null}
    <MarkdownEditor {carta} bind:value={$currentEdit.markdown} mode="tabs" />
    <button class="text-3xl text-text text-center w-full" onclick={push}
        >Update/Upload</button
    >

    <button class="text-3xl text-text text-center w-full" onclick={newhtml}
        >Generate Preview!</button
    >

    <div
        class="bg-crust border-2 border-blue rounded-md p-4 flex flex-col text-text gap-4"
    >
        <div class="options text-center w-full text-4xl nerdfont">Options</div>
        <div class="flex flex-row gap-4">
            <!-- Pick a Title -->
            <div class="border-2 border-surface0 p-2 rounded-md">
                <button class="bg-base border-2 p-1 rounded-md" style="border-color: {$currentEdit.title}; color: {$currentEdit.title}" onclick={() => {$currentEdit.title = "Title Here!"}}>Pick Title</button>
                <input
                    class="bg-base"
                    type="text"
                    bind:value={$currentEdit.title}
                />
            </div>
            <!-- thumbnail upload fucntion -->
            <div class="border-2 border-surface0 p-2 rounded-md">
                Image Upload
                <input
                    class="bg-base"
                    type="file"
                    bind:this={$imgInput}
                    onchange={newImage}
                />
            </div>
            <!-- Color Picker -->
            <div class="border-2 border-surface0 p-2 rounded-md">
                <button class="bg-base border-2 p-1 rounded-md" style="border-color: {$currentEdit.color}; color: {$currentEdit.color}" onclick={() => {$currentEdit.color = getRandomPastelColor()}}>Pick Color</button>
                <input
                    class="bg-base"
                    type="text"
                    bind:value={$currentEdit.color}
                />
            </div>
            <!-- Tag Picker -->
             <div class="w-full">
                 <TagPicker />
             </div>
        </div>
    </div>
    
    <Preview />
{/if}

<!-- <div bind:this={container}></div> -->
