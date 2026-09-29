<script lang="ts">
    import "./picker.css";
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
            thumbnail: pb.files.getURL(data, data.Thumbnail),
            color: data.Color,
        }
        $currentEdit = current;
    }  

    async function deleteProj(iddel: any) {
        let deleteButton: any = document.getElementById("delPR-" + iddel);
        console.log(deleteButton.getAttribute("data-confirmed"));
        if (deleteButton.getAttribute("data-confirmed") == "ST-A") {
            deleteButton.innerHTML = "Are you sure?";
            deleteButton.setAttribute("data-confirmed", "ST-B");
        } else if (deleteButton.getAttribute("data-confirmed") == "ST-B") {
            deleteButton.innerHTML = "Are you SUPER sure?";
            deleteButton.setAttribute("data-confirmed", "ST-C");
        } else {
            await pb.collection("Projects").delete(iddel);
            await getProjects();
            getProject("0");
            deleteButton.innerHTML = "Delete Project";
            deleteButton.setAttribute("data-confirmed", "ST-A");
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

<div class="picker-head">
    <h2 class="display-title">Projects{#if $projects}<sup>{String($projects.length).padStart(2, "0")}</sup>{/if}</h2>
    <button class="pill" onclick={getProjects}>refresh ↻</button>
</div>
{#if $projects != null}
    <ol id="postList" class="picker-grid">
        {#each $projects as post}
            <li class="picker-card">
                <button class="picker-open" onclick={() => {getProject(post.id)}}>
                    <img src={pb.files.getURL(post, post.Thumbnail)} alt={post.Title + "'s Thumbnail"} />
                    <span class="picker-title" style="--dot: {post.Color}">{post.Title}</span>
                    <span class="picker-date">{new Date(post.created).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }).toLowerCase()}</span>
                    <span class="picker-tags">{(post.expand?.Tags ?? []).map((tag: any) => tag.tagName).join(" · ")}</span>
                    <span class="picker-excerpt">{post.Markdown.substring(0, 100)}</span>
                </button>
                <button id="delPR-{post.id}" class="picker-delete" onclick={async () => {await deleteProj(post.id)}} data-confirmed="ST-A">Delete Project</button>
            </li>
        {/each}
    </ol>
{/if}
