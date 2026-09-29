<script lang="ts">
    import { get } from "svelte/store";
    import { pb, allTags, currentEdit, getRandomPastelColor } from "./stores";
    async function getAllTags() {
        $allTags = null;
        $allTags = await pb.collection("Tags").getFullList({
            sort: "-created",
            expand: "tagName",
        });
    }
    getAllTags();

    let showdialog = $state(false);
    function changeShow() {
        showdialog = !showdialog;
    }
    let isProjTag = $state(false);
    function editProjTag() {
        isProjTag = true; 
    }
    function editTags() {
        isProjTag = false;
    }
    let newTag: any = $state({
        newFlag: false,
        name: "",
        iconData: "",
        iconFile: null,
        color: "",
    });
    newTag.color = getRandomPastelColor();
    let showIcoImg = $state(false);
    let icoImg: any = $state(null);
    function toggleTagMaker() {
        newTag.newFlag = !newTag.newFlag;
    }

    function updateTags(newtag: any) {
        if (!isProjTag) {
            for(let i = 0; i < $currentEdit.tags.length; i++) {
                if($currentEdit.tags[i].id == newtag.id) {
                    return;
                }
            }
            $currentEdit.tags.push(newtag);
            $currentEdit.tags = $currentEdit.tags;   
        } else {
            $currentEdit.projectTag = newtag;
        }
    }

    function deleteTag(tagDel: any) {
        let index = $currentEdit.tags.indexOf(tagDel);
        if (index !== -1) {
            $currentEdit.tags.splice(index, 1);
            $currentEdit.tags = $currentEdit.tags;
        }
    }
    async function handleNewTagIcon() {
        console.log(newTag.icon.files);
        const file = newTag.icon.files[0];
        newTag.iconFile = file;
        if (file) {
            showIcoImg = true;
            const reader = new FileReader();
            reader.addEventListener("load", async function () {
                newTag.iconData = reader.result;
                // icoImg.setAttribute("src", reader.result);
                // Must wait for image to load in DOM, not just load from FileReader
                newTag.color = getRandomPastelColor();
            });
            reader.readAsDataURL(file);
            return;
        }
        showIcoImg = false;
        console.log(icoImg);
    }

    async function newTagUpload() {
        let payload = new FormData();
        payload.append("tagName", newTag.name);
        payload.append("Icon", newTag.iconFile);
        payload.append("color", newTag.color);
        await pb.collection("Tags").create(payload);
        getAllTags();
        newTag.newFlag = false;
    }
    $inspect($currentEdit.tags) 
</script>

<div class="tags">
    <span class="tags-label">tags</span>
    <ol class="chip-row">
        {#if $currentEdit.tags != null}
            {#each $currentEdit.tags as tag}
                <li>
                    <button class="chip" title="remove tag" onclick={() => {deleteTag(tag)}} style="--chip: {tag.color}">
                        <img src={pb.files.getURL(tag, tag.Icon)} alt="" />
                        {tag.tagName} <span class="x" aria-hidden="true">×</span>
                    </button>
                </li>
            {/each}
        {/if}
        <li>
            <button class="chip add" onclick={() => { changeShow(); editTags(); }}>+ tag</button>
        </li>
    </ol>
    {#if $currentEdit.isPost == false}
        <span class="tags-label">project tag</span>
        <div class="chip-row">
            {#if $currentEdit.projectTag != null && $currentEdit.projectTag.tagName}
                <span class="chip" style="--chip: {$currentEdit.projectTag.color}">
                    <img src={pb.files.getURL($currentEdit.projectTag, $currentEdit.projectTag.Icon)} alt="" />
                    {$currentEdit.projectTag.tagName}
                </span>
            {/if}
            <button class="chip add" onclick={() => { changeShow(); editProjTag(); }}>{$currentEdit.projectTag?.tagName ? "change" : "+ project tag"}</button>
        </div>
    {/if}
</div>

<dialog open={showdialog} class="tag-dialog">
    <div class="dialog-head">
        <span class="tags-label">{isProjTag ? "pick a project tag" : "pick tags"}</span>
        <button class="chip add" onclick={changeShow}>done</button>
    </div>
    <ul class="chip-row">
        {#if $allTags != null}
            {#each $allTags as tagItem}
                <li>
                    <button class="chip" onclick={() => {updateTags(tagItem)}} style="--chip: {tagItem.color}">
                        <img src={pb.files.getURL(tagItem, tagItem.Icon)} alt="" />
                        {tagItem.tagName}
                    </button>
                </li>
            {/each}
            <li>
                <button class="chip add" onclick={toggleTagMaker}>{newTag.newFlag ? "cancel" : "+ new tag"}</button>
            </li>
        {/if}
    </ul>
    {#if newTag.newFlag == true}
        <div class="new-tag">
            <label>
                <span class="tags-label">name</span>
                <input type="text" bind:value={newTag.name} />
            </label>
            <label>
                <span class="tags-label">icon</span>
                <input type="file" bind:this={newTag.icon} onchange={handleNewTagIcon} />
            </label>
            <label>
                <span class="tags-label">color</span>
                <span class="color-row">
                    <input type="text" bind:value={newTag.color} />
                    <button class="chip" style="--chip: {newTag.color}; color: {newTag.color}" onclick={() => {newTag.color = getRandomPastelColor()}}>random</button>
                </span>
            </label>
            {#if showIcoImg}
                <span class="chip" style="--chip: {newTag.color}">
                    <img src={newTag.iconData} alt="" />
                    {newTag.name}
                </span>
            {/if}
            <button onclick={newTagUpload} class="pill solid">create tag</button>
        </div>
    {/if}
</dialog>

<style>
    .tags {
        display: grid;
        gap: 0.6rem;
    }

    .tags-label {
        color: var(--muted);
        font-family: var(--font-mono);
        font-size: 0.75rem;
    }

    .chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .chip {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.3rem 0.75rem 0.3rem 0.4rem;
        border: 1px solid color-mix(in srgb, var(--chip, var(--line-bright)) 50%, transparent);
        border-radius: 999px;
        color: var(--paper);
        background: color-mix(in srgb, var(--chip, transparent) 10%, transparent);
        font-family: var(--font-mono);
        font-size: 0.75rem;
    }

    .chip img {
        width: 18px;
        height: 18px;
    }

    .chip .x {
        color: var(--muted);
    }

    .chip.add {
        padding-left: 0.75rem;
        color: var(--muted-bright);
        border-style: dashed;
        border-color: var(--line-bright);
    }

    .chip.add:hover {
        color: var(--accent);
        border-color: var(--accent);
    }

    .tag-dialog {
        position: fixed;
        inset: 50% auto auto 50%;
        z-index: 200;
        width: min(92vw, 640px);
        max-height: 80vh;
        overflow: auto;
        margin: 0;
        padding: 1.4rem;
        border: 1px solid var(--line-bright);
        border-radius: 18px;
        color: var(--paper);
        background: var(--ink-raised);
        box-shadow: 0 30px 80px -20px #000;
        transform: translate(-50%, -50%);
    }

    .dialog-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
    }

    .new-tag {
        display: grid;
        gap: 0.9rem;
        margin-top: 1.4rem;
        padding-top: 1.2rem;
        border-top: 1px solid var(--line);
    }

    .new-tag label {
        display: grid;
        gap: 0.4rem;
    }

    .new-tag input {
        padding: 0.6rem 0.8rem;
        border: 1px solid var(--line-bright);
        border-radius: 10px;
        color: var(--paper);
        background: var(--ink);
        font: inherit;
    }

    .color-row {
        display: flex;
        gap: 0.5rem;
    }

    .color-row input {
        flex: 1;
    }

    .new-tag .pill {
        justify-self: start;
        cursor: pointer;
    }
</style>
