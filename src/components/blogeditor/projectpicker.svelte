<script lang="ts">
    import {projects, currentEdit, pb, showImage} from "./stores";
    import type {currentData} from "./stores";
    async function getProjects() {
        $projects = await pb.collection("Projects").getFullList({
            sort: "-created",
            expand: "Tags",
        });
    }
    
    async function getProject(id: string) {
        let data = await pb.collection("Projects").getOne(id, {
            expand: "Tags,ProjectTag",
        });
        if (data == undefined) throw new Error("Post not found");
        if (data.expand == undefined) throw new Error("Something wrong with expand");
        $showImage = false;
        let current: currentData = {
            id: id,
            isPost: false,
            isEditing: true,
            title: data.Title,
            tags: data.expand.Tags,
            projectTag: data.expand.ProjectTag,
            markdown: data.Markdown,
            html: data.Html,
            thumbnail: pb.files.getUrl(data, data.Thumbnail),
            color: data.Color,
        }
        $currentEdit = current;
    }  

    async function deleteProj(iddel: any) {
        let deleteButton: any = document.getElementById("delPR-" + iddel);
        console.log(deleteButton.getAttribute("confirmed"));
        if (deleteButton.getAttribute("confirmed") == "ST-A") {
            deleteButton.innerHTML = "Are you sure?";
            deleteButton.setAttribute("confirmed", "ST-B");
        } else if (deleteButton.getAttribute("confirmed") == "ST-B") {
            deleteButton.innerHTML = "Are you SUPER sure?";
            deleteButton.setAttribute("confirmed", "ST-C");
        } else {
            await pb.collection("Projects").delete(iddel);
            await getProjects();
            getProject("0");
            deleteButton.innerHTML = "Delete Project";
            deleteButton.setAttribute("confirmed", "ST-A");
        }
    }

    async function setup() {
        await getProjects();
        await getProject($projects[0].id);
    }
    $effect(() => {
        setup();
    });
</script>


<button class="pb-2 nerdfont text-center w-full text-text text-7xl" onclick={getProjects}>Projects</button>
<div class="h-auto w-full bg-mantle text-text text-5xl">
    {#if $projects != null}
        <div>
            <ol id="postList" class="w-full grid grid-cols-5 gap-2 nerdfont">
                {#each $projects as post}
                    <li class="text-text text-sm w-full text text-center bg-base mx-4 rounded-md py-2 items-center">
                        <button onclick={() => {getProject(post.id)}}>
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
                        <button id="delPR-{post.id}" class="bg-overlay1 hover:bg-red w-11/12 rounded-md" onclick={async () => {await deleteProj(post.id)}} data-confirmed="false"> Delete Project </button>
                    </li>
                {/each}
            </ol>
        </div>
    {/if}
</div>