<script lang="ts">
    import { get } from "svelte/store";
    import {posts, currentEdit, pb, showImage} from "./stores";
    import type {currentData} from "./stores";

    // $inspect($posts);
    // $inspect($currentEdit);
    async function getPosts() {
        $posts = await pb.collection("Posts").getFullList({
            sort: "-created",
            expand: "tagName",
        });
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
        }
        $currentEdit = current;
    }
    async function getPost(id: string) {
        let data = await pb.collection("Posts").getOne(id, {
            expand: "tagName",
        });
        if (data == undefined) throw new Error("Post not found");
        if (data.expand == undefined) throw new Error("Something wrong with expand");
        $showImage = false;
        let current: currentData = {
            id: id,
            isPost: true,
            isEditing: true,
            title: data.Title,
            tags: data.expand.tagName,
            projectTag: null,
            markdown: data.Markdown,
            html: data.Html,
            thumbnail: pb.files.getUrl(data, data.Thumbnail),
            color: data.Color,
        }
        $currentEdit = current;
    }

    async function setup() {
        await getPosts();
        await getPost($posts[0].id);
    }
    $effect(() => {
        setup();
    });
</script>


<div class="h-auto w-1/4 bg-mantle text-text text-5xl">
    <button class="pb-2 nerdfont" onclick={getPosts}>Posts</button>
    <button class="w-full rounded-md bg-overlay2 hover:bg-green" onclick={newPost}>+</button>
    {#if posts != null}
        <div>
            <ol id="postList" class="w-full flex flex-col gap-2 nerdfont">
                {#each $posts as post}
                    <li class="text-text text-sm text text-center bg-base mx-4 rounded-md py-2 items-center">
                        <button onclick={() => {getPost(post.id)}}>
                            <div class="text-text">
                                {post.Title}
                            </div>
                            <div class="text-blue">
                                {post.created}
                            </div>
                        </button>
                        <button id="del-{post.id}" class="bg-overlay1 hover:bg-red w-full mx-2 rounded-md" onclick={deletePost(post.id)} confirmed="false"> X </button>
                    </li>
                {/each}
            </ol>
        </div>
    {/if}
</div>