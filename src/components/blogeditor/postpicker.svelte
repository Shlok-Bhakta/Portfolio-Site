<script lang="ts">
    import "./picker.css";
    import {posts, currentEdit, pb, showImage} from "./stores";
    import type {currentData} from "./stores";
    async function getPosts() {
        $posts = await pb.collection("Posts").getFullList({
            sort: "-created",
            expand: "tagName",
        });
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
            thumbnail: pb.files.getURL(data, data.Thumbnail),
            color: data.Color,
        }
        $currentEdit = current;
    }  
    async function deletePost(id: any) {
        let deleteButton: any = document.getElementById("del-" + id);
        console.log(deleteButton.getAttribute("data-confirmed"));
        if (deleteButton.getAttribute("data-confirmed") == "false") {
            deleteButton.innerHTML = "Are you sure?";
            deleteButton.setAttribute("data-confirmed", "true");
        } else {
            await pb.collection("Posts").delete(id);
            await getPosts();
            getPost("0");
            deleteButton.innerHTML = "Delete Post";
            deleteButton.setAttribute("data-confirmed", "false");
        }
    }

    async function setup() {
        await getPosts();
        await getPost($posts[0].id);
    }
    $effect(() => {
        setup();
    });
</script>

<div class="picker-head">
    <h2 class="display-title">Posts{#if $posts}<sup>{String($posts.length).padStart(2, "0")}</sup>{/if}</h2>
    <button class="pill" onclick={getPosts}>refresh ↻</button>
</div>
{#if $posts != null}
    <ol id="postList" class="picker-grid">
        {#each $posts as post}
            <li class="picker-card">
                <button class="picker-open" onclick={() => {getPost(post.id)}}>
                    <img src={pb.files.getURL(post, post.Thumbnail)} alt={post.Title + "'s Thumbnail"} />
                    <span class="picker-title" style="--dot: {post.Color}">{post.Title}</span>
                    <span class="picker-date">{new Date(post.created).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }).toLowerCase()}</span>
                    <span class="picker-tags">{(post.expand?.tagName ?? []).map((tag: any) => tag.tagName).join(" · ")}</span>
                    <span class="picker-excerpt">{post.Markdown.substring(0, 100)}</span>
                </button>
                <button id="del-{post.id}" class="picker-delete" onclick={async () => {await deletePost(post.id)}} data-confirmed="false">Delete Post</button>
            </li>
        {/each}
    </ol>
{/if}
