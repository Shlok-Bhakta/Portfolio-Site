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
    $inspect($posts);

    async function setup() {
        await getPosts();
        await getPost($posts[0].id);
    }
    $effect(() => {
        setup();
    });
</script>


<button class="pb-2 nerdfont text-center w-full text-text text-7xl" onclick={getPosts}>Posts</button>
<button class="w-full rounded-md bg-overlay2 hover:bg-green" onclick={newPost}>New Post</button>
<div class="h-auto w-full bg-mantle text-text text-5xl">
    {#if posts != null}
        <div>
            <ol id="postList" class="w-full grid grid-cols-5 grid-flow-col gap-2 nerdfont">
                {#each $posts as post}
                    <li class="text-text text-sm w-full text text-center bg-base mx-4 rounded-md py-2 items-center">
                        <button onclick={() => {getPost(post.id)}}>
                            <div class="" style="color:{post.Color};"> 
                                {post.Title}
                            </div>
                            <div class="text-blue">
                                {post.created}
                            </div>
                            <img src={pb.files.getUrl(post, post.Thumbnail)} alt={post.Title + "'s Thumbnail"} class="w-11/12 mx-auto aspect-auto rounded-md" />
                            <div class="flex flex-wrap flex-row gap-1">
                                {#each post.expand.tagName as tag}
                                    <div class="text-blue bg-surface0 rounded-md px-2 py-1 w-fit">
                                        {tag.tagName}
                                    </div>
                                {/each}
                            </div>
                            <div class="text-text">
                                {post.Markdown.substring(0, 100)}
                            </div>
                        </button>
                        <!-- <button id="del-{post.id}" class="bg-overlay1 hover:bg-red w-11/12 rounded-md" onclick={deletePost(post.id)} confirmed="false"> X </button> -->
                    </li>
                {/each}
            </ol>
        </div>
    {/if}
</div>