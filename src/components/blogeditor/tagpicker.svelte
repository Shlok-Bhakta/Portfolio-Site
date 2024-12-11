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

<div class="text-text nerdfont">
    Tags:
    <ol class="flex flex-wrap space-x-1">
        {#if $currentEdit.tags != null}
            {#each $currentEdit.tags as tag}
                <li class="">
                    <button onclick={() => {deleteTag(tag)}}>
                        <div class="flex flex-row items-center space-x-2 rounded-full bg-surface0 border-[1px] w-fit" style="border-color: {tag.color}">
                            <img class="pl-2 aspect-square h-8 w-8" src={pb.files.getUrl(tag, tag.Icon)} alt={tag.tagName} />
                            <div class="pr-2 text-sm text-text nerdfont">{tag.tagName}</div>
                        </div>
                    </button>
                </li>
            {/each}
        {/if}
        <li>
            <button
                class="p-2 bg-mantle rounded-md"
                onclick={() => {
                    changeShow();
                    editTags();
                }}>
        +</button>
        </li>
    </ol>
    <!-- {#if projectActive}
        <div>
            ProjectTag:
            {#if CurrentProjectTag != null}
                <div>
                    <div class="flex flex-row items-center space-x-2 rounded-full bg-surface0 border-[1px] w-fit" style="border-color: {CurrentProjectTag.color}">
                        <img class="pl-2 aspect-square h-8 w-8" src={pb.files.getUrl(CurrentProjectTag, CurrentProjectTag.Icon)} alt={CurrentProjectTag.tagName} />
                        <div class="pr-2 text-sm text-text nerdfont">{CurrentProjectTag.tagName}</div>
                    </div>
                </div>
            {/if}
            <button
                class="p-4 bg-mantle rounded-md m-3"
                onclick={() => {
                    changeShow();
                    editProjTag();
                }}>+</button
            >
        </div>
    {/if} -->

</div>
<dialog open={showdialog}>
    <ul class="flex flex-wrap list-none bg-base rounded-md">
        {#if $allTags != null}
            {#each $allTags as tagItem}
                <li>
                    <button onclick={() => {updateTags(tagItem)}}>
                        <div class="flex flex-row items-center space-x-2 rounded-full bg-surface0 border-[1px] w-fit" style="border-color: {tagItem.color}">
                            <img class="pl-2 aspect-square h-8 w-8" src={pb.files.getUrl(tagItem, tagItem.Icon)} alt={tagItem.tagName} />
                            <div class="pr-2 text-sm text-text nerdfont">{tagItem.tagName}</div>
                        </div>
                    </button>
                </li>
            {/each}
            <li>
                <button class="p-4 py-1 bg-mantle rounded-md" onclick={toggleTagMaker}>+</button>
            </li>
        {/if}
    </ul>
    {#if newTag.newFlag == true}
        <div class="bg-overlay0 nerdfont">
            <div>
                tagName:
                <input type="text" bind:value={newTag.name} />
            </div>
            <div>
                tagIcon:
                <input type="file" bind:this={newTag.icon} onchange={handleNewTagIcon} />
                {#if showIcoImg}
                    <img class="aspect-square w-8" src={newTag.iconData} alt={newTag.name} />
                {/if}
            </div>
            <div>
                tagColor:
                <input type="text" bind:value={newTag.color} />
            </div>
            <div>
                submit:
                <button onclick={newTagUpload} class="bg-subtext1 border-2 border-green">Submit</button>
            </div>
            {#if showIcoImg}
                <div class="flex flex-row items-center space-x-2 rounded-full bg-surface0 border-[1px] w-fit" style="border-color: {newTag.color}">
                    <img class="pl-2 aspect-square h-8 w-8" src={newTag.iconData} alt={newTag.name} />
                    <div class="pr-2 text-sm text-text nerdfont">{newTag.name}</div>
                </div>
            {/if}
        </div>
    {/if}
</dialog>