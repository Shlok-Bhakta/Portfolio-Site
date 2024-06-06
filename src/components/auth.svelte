<script>
    import PocketBase from "pocketbase";
    import { unified } from "unified";
    import rehypeStringify from "rehype-stringify";
    import remarkParse from "remark-parse";
    import remarkRehype from "remark-rehype";

    import rehypePrism from "rehype-prism";

    import remarkMath from "remark-math";
    import rehypeMathjax from "rehype-mathjax";

    import "../styles/global.css";
    import "../styles/blog.css";

    import "prismjs/components/prism-go";
    import "prismjs/components/prism-java";
    import "prismjs/components/prism-python";
    import "prismjs/components/prism-yaml";
    import "prismjs/components/prism-javascript";

    import ColorThief from "color-thief-node";

    let username;
    let password;
    let currentEditingID = null;
    let color = null;
    let showImage = false;
    const pb = new PocketBase("https://db.shlokbhakta.dev");
    // const pb = new PocketBase("http://172.20.0.3:8090");

    let authData = null;
    async function login() {
        try {
            authData = await pb.admins.authWithPassword(username, password);
        } catch (e) {
            document.getElementById("user").innerHTML = "wrong!";
        }
        console.log(authData);
    }

    let markdown = null;
    let file = null;
    async function updatemd() {
        file = await unified()
            .use(remarkParse)
            .use(remarkMath)
            .use(remarkRehype)
            .use(rehypeMathjax)
            .use(rehypePrism, { plugins: ["copy-to-clipboard"] })
            .use(rehypeStringify)
            .process(markdown);
        document.getElementById("html").innerHTML = String(file);
    }

    let posts = null;
    async function getposts() {
        posts = await pb.collection("Posts").getFullList({
            sort: "-created",
            expand: "tagName",
        });
    }

    let CurrentTitle = null;
    let CurrentHTML = null;
    let tags = null;
    let imglink = null;
    // gets a specific post index and sets it to the active title
    async function fillBoxes(postIndex) {
        await getposts();
        CurrentTitle = posts[postIndex].Title;
        markdown = posts[postIndex].Markdown;
        CurrentHTML = posts[postIndex].Html;
        tags = posts[postIndex].expand.tagName;
        imglink = pb.files.getUrl(posts[postIndex], posts[postIndex].Thumbnail);
        currentEditingID = posts[postIndex].id;
        color = posts[postIndex].Color;
        showImage = false;
        updatemd();
    }

    async function fillBoxesByID(ID) {
        await getposts();
        let aPost = await pb.collection("Posts").getOne(ID, {
            expand: "tagName",
        });
        CurrentTitle = aPost.Title;
        markdown = aPost.Markdown;
        CurrentHTML = aPost.Html;
        tags = aPost.expand.tagName;
        imglink = pb.files.getUrl(aPost, aPost.Thumbnail);
        currentEditingID = ID;
        color = aPost.Color;
        showImage = false;
        updatemd();
    }
    let allTags = null;
    async function getAllTags() {
        allTags = await pb.collection("Tags").getFullList({
            sort: "-created",
            expand: "tagName",
        });
    }
    fillBoxes(0);
    getAllTags();
    // fillBoxesByID("hss6wk6yxi3a0sg");

    let showdialog = false;
    function changeShow() {
        showdialog = !showdialog;
    }

    function updateTags(newtag) {
        let index = tags.indexOf(newtag);
        if (index !== -1) {
            return;
        }
        tags.push(newtag);
        console.log(tags);
        tags = tags;
    }

    function deleteTag(tagDel) {
        let index = tags.indexOf(tagDel);
        if (index !== -1) {
            tags.splice(index, 1);
        }
        console.log(tags);
        tags = tags;
    }

    let imgInput;
    let image;

    async function newImage() {
        const file = imgInput.files[0];
        if (file) {
            showImage = true;
            const reader = new FileReader();
            reader.addEventListener("load", async function () {
                image.setAttribute("src", reader.result);
                // Must wait for image to load in DOM, not just load from FileReader
                const palette = await ColorThief.getColor(image);
                console.log(palette);
                color = "#" + palette[0].toString(16) + palette[1].toString(16) + palette[2].toString(16);
            });
            reader.readAsDataURL(file);
            return;
        }
        showImage = false;
    }
    // function getCol(image) {
    // }
    async function submitUpdate() {
        let uploadTags = [];

        for (let i = 0; i < tags.length; i++) {
            uploadTags.push(tags[i].id);
        }

        uploadTags = Array.from(new Set(uploadTags));
        console.log(uploadTags);
        const data = {
            Title: CurrentTitle,
            tagName: uploadTags,
            Markdown: markdown,
            Html: String(file),
            Thumbnail: imgInput.files[0],
            Color: color,
        };

        console.log(data);
        const updateRecord = await pb.collection("Posts").update(currentEditingID, data);
        console.log(updateRecord);
    }

    async function submitNewPost() {
        let payload = new FormData();
        payload.append("Title", CurrentTitle);
        for (let i = 0; i < tags.length; i++) {
            payload.append("tagName", tags[i].id);
        }
        payload.append("Markdown", markdown);
        payload.append("Html", String(file));
        payload.append("Thumbnail", imgInput.files[0]);
        payload.append("Color", color);
        console.log(payload);
        const createRecord = await pb.collection("Posts").create(payload);
        console.log(createRecord);
    }
    updatemd();

    let makeNewTag = false;
    let newTagName = null;
    let newTagIcon = null;
    let newTagColor = null;
    let showIcoImg = false;
    let icoImg;
    function toggleTagMaker() {
        makeNewTag = !makeNewTag;
    }

    async function handleNewTagIcon() {
        console.log(newTagIcon.files);
        const file = newTagIcon.files[0];
        if (file) {
            showIcoImg = true;
            const reader = new FileReader();
            reader.addEventListener("load", async function () {
                icoImg.setAttribute("src", reader.result);
                // Must wait for image to load in DOM, not just load from FileReader
                const palette = await ColorThief.getColor(icoImg);
                console.log(palette);
                newTagColor = "#" + palette[0].toString(16) + palette[1].toString(16) + palette[2].toString(16);
            });
            reader.readAsDataURL(file);
            return;
        }
        showIcoImg = false;
        console.log(icoImg);
    }

    async function newTagUpload() {
        let payload = new FormData();
        payload.append("tagName", newTagName);
        payload.append("Icon", newTagIcon.files[0]);
        payload.append("color", newTagColor);
        await pb.collection("Tags").create(payload);
        getAllTags();
        makeNewTag = false;
    }
</script>

{#if authData != null}
    <!-- left sidebar     -->
    <div class="flex">
        <div class="h-auto w-auto bg-mantle text-text text-5xl">
            <button class="px-32 pb-2 nerdfont" on:click={getposts}>Posts</button>
            {#if posts != null}
                <div>
                    <ol class="w-full flex flex-col gap-2 nerdfont">
                        {#each posts as post}
                            <li class="text-text text-sm text text-center bg-base mx-4 rounded-md py-2">
                                <button on:click={fillBoxesByID(post.id)}>
                                    <div class="text-text">
                                        {post.Title}
                                    </div>
                                    <div class="text-blue">
                                        {post.created}
                                    </div>
                                </button>
                            </li>
                        {/each}
                    </ol>
                </div>
            {/if}
        </div>
        <div class="flex flex-col w-full max-w-4xl gap-4">
            <div class="text-text nerdfont">
                Title
                <input class="w-full border-2 rounded-md" type="text" bind:value={CurrentTitle} placeholder={CurrentTitle} />
            </div>
            <div class="text-text nerdfont">
                Tags:
                <ol class="flex flex-wrap space-x-1">
                    {#if tags != null}
                        {#each tags as tag}
                            <li class="">
                                <button on:click={deleteTag(tag)}>
                                    <div class="flex flex-row items-center space-x-2 rounded-full bg-surface0 border-[1px] w-fit" style="border-color: {tag.color}">
                                        <img class="pl-2 aspect-square h-8 w-8" src={pb.files.getUrl(tag, tag.Icon)} alt={tag.tagName} />
                                        <div class="pr-2 text-sm text-text nerdfont">{tag.tagName}</div>
                                    </div>
                                </button>
                            </li>
                        {/each}
                    {/if}
                </ol>
                <button class="p-4 bg-mantle rounded-md m-3" on:click={changeShow}>+</button>
                <dialog open={showdialog}>
                    <ul class="flex flex-wrap list-none bg-base rounded-md">
                        {#if allTags != null}
                            {#each allTags as tagItem}
                                <li>
                                    <button on:click={updateTags(tagItem)}>
                                        <div class="flex flex-row items-center space-x-2 rounded-full bg-surface0 border-[1px] w-fit" style="border-color: {tagItem.color}">
                                            <img class="pl-2 aspect-square h-8 w-8" src={pb.files.getUrl(tagItem, tagItem.Icon)} alt={tagItem.tagName} />
                                            <div class="pr-2 text-sm text-text nerdfont">{tagItem.tagName}</div>
                                        </div>
                                    </button>
                                </li>
                            {/each}
                            <li>
                                <button class="p-4 py-1 bg-mantle rounded-md" on:click={toggleTagMaker}>+</button>
                            </li>
                        {/if}
                    </ul>
                    {#if makeNewTag == true}
                        <div class="bg-overlay0 nerdfont">
                            <div>
                                tagName:
                                <input type="text" bind:value={newTagName} />
                            </div>
                            <div>
                                tagIcon:
                                <input type="file" bind:this={newTagIcon} on:change={handleNewTagIcon} />
                                {#if showIcoImg}
                                    <img class="aspect-square w-8" bind:this={icoImg} alt={newTagName} />
                                {/if}
                            </div>
                            <div>
                                tagColor:
                                <input type="text" bind:value={newTagColor} />
                            </div>
                            <div>
                                submit:
                                <button on:click={newTagUpload} class="bg-subtext1 border-2 border-green">Submit</button>
                            </div>
                            {#if showIcoImg}
                                <div class="flex flex-row items-center space-x-2 rounded-full bg-surface0 border-[1px] w-fit" style="border-color: {newTagColor}">
                                    <img class="pl-2 aspect-square h-8 w-8" bind:this={icoImg} alt={newTagName} />
                                    <div class="pr-2 text-sm text-text nerdfont">{newTagName}</div>
                                </div>
                            {/if}
                        </div>
                    {/if}
                </dialog>
                <div>
                    Image Upload
                    <input type="file" bind:this={imgInput} on:change={newImage} />
                </div>
                <div>
                    Edit Color
                    <input type="text" bind:value={color} />
                </div>
            </div>
            <div class="bg-crust border-2 border-blue text-center rounded-md p-4 multiline flex flex-col h-96 gap-1">
                <textarea type="text" class="border-2 border-text w-full h-full rounded-md" bind:value={markdown} />
                <button class="text-text border-2 border-peach rounded-lg" on:click={updatemd}>remark</button>
            </div>
            <div class="w-4xl p-3 bg-mantle border-2 border-overlay1 h-fit rounded-md">
                <div class="flex justify-center">
                    {#if showImage}
                        <img class="aspect-video w-[calc(100vw-40px)] max-w-4xl mt-4 rounded-md border-2 border-text" style="border-color: {color};" bind:this={image} alt={CurrentTitle} />
                    {:else}
                        <img class="aspect-video w-[calc(100vw-40px)] max-w-4xl mt-4 rounded-md border-2 border-text" style="border-color: {color};" src={imglink} alt={CurrentTitle} />
                    {/if}
                </div>
                <div class="title text-center text-text nerdfont">{CurrentTitle}</div>
                <div id="html"></div>
            </div>
            <button class="text-text nerdfont bg-base border-2 border-sky rounded md" on:click={submitUpdate}> Update </button>
            <button class="text-text nerdfont bg-base border-2 border-sky rounded md" on:click={submitNewPost}> Create </button>
        </div>
    </div>
{:else}
    <div class="flex justify-center">
        <div class="flex flex-col space-y-3 w-96">
            <input class="w-full border-2 rounded-md" id="user" type="email" bind:value={username} />
            <input class="w-full border-2 rounded-md" type="password" bind:value={password} />
            <button class="text-text border-2 rounded-md bg-mantle" on:click={login}>auth</button>
        </div>
    </div>
{/if}
