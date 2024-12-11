<script lang="ts">
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
            thumbnail: pb.files.getUrl(data, data.Thumbnail),
            color: data.Color,
        }
        $currentEdit = current;
    }  
    async function deletePost(id) {
        let deleteButton = document.getElementById("del-" + id);
        console.log(deleteButton.getAttribute("data-confirmed"));
        if (deleteButton.getAttribute("data-confirmed") == "false") {
            deleteButton.innerHTML = "Are you sure?";
            deleteButton.setAttribute("data-confirmed", "true");
        } else {
            await pb.collection("Posts").delete(id);
            await getPosts();
            getPost("0");
            deleteButton.innerHTML = "X";
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


<button class="pb-2 nerdfont text-center w-full text-text text-7xl" onclick={getPosts}>Posts</button>
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
                        @ts-ignore
                        <button id="del-{post.id}" class="bg-overlay1 hover:bg-red w-11/12 rounded-md" onclick={async () => {await deletePost(post.id)}} data-confirmed="false"> Delete Post </button>
                    </li>
                {/each}
            </ol>
        </div>
    {/if}
</div>