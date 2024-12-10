import { persisted } from "svelte-persisted-store";
import { writable } from "svelte/store";
import PocketBase from "pocketbase"
export let auth: any = persisted("auth", {
    username: "",
    password: "",
});

// holds the current session pretty sure its not needed
export let session = writable(null); 

// Stuff for the Post Selector
export let posts: any = writable(null);

// stuff for the Project selector
export let projects = writable(null);

// stuff for the tag selector
export let allTags = writable(null);

// stuff for editing a post/project
export let currentTitle = writable(null);
export let currentMarkdown = writable(null);
export let currentEditingID = writable(null);
export let currentHTML = writable(null);
export let currentTags = writable(null);
export let currentColor = writable(null);
export let showImage = writable(false);
export let projectActive = writable(false);
export let currentProjectTag = writable(null);

export type currentData = {
    id: string | null,
    isPost: boolean,
    isEditing: boolean,
    title: string,
    tags: string[],
    projectTag: string | null,
    markdown: string,
    html: string,
    thumbnail: string | null,
    color: string,
}

let current: currentData = {
    id: null,
    isPost: false,
    isEditing: false,
    title: "Add Title Here",
    tags: [],
    projectTag: null,
    markdown: "# Hello",
    html: "<h1>Hello</h1>",
    thumbnail: null,
    color: "#F8C76A",
}



export let currentEdit = writable(current);

function constructCreatePostPayload(data: currentData): FormData {
    let payload = new FormData();
    payload.append("Title", data.title);
    for(let i = 0; i < data.tags.length; i++) {
        payload.append("tagName", data.tags[i]);
    }
    payload.append("Markdown", data.markdown);
    payload.append("Html", data.color);
    if (data.thumbnail == null) throw new Error("Thumbnail is null");
    payload.append("Thumbnail", data.thumbnail);
    payload.append("Color", data.color);
    return payload;
}

function constructUpdatePostPayload(data: currentData): any {
    let uploadTags = [];
    for(let i = 0; i < data.tags.length; i++) {
        uploadTags.push(data.tags[i]);
    }
    uploadTags = Array.from(new Set(uploadTags));
    if (data.thumbnail == null) throw new Error("Thumbnail is null");
    return {
        Title: data.title,
        tagName: uploadTags,
        Markdown: data.markdown,
        Html: data.html,
        Thumbnail: data.thumbnail,
        Color: data.color,
    }
}

function constructCreateProjectPayload(data: currentData): FormData {
    let payload = new FormData();
    payload.append("Title", data.title);
    for(let i = 0; i < data.tags.length; i++) {
        payload.append("Tags", data.tags[i]);
    }
    payload.append("Markdown", data.markdown);
    payload.append("Html", data.color);
    if (data.thumbnail == null) throw new Error("Thumbnail is null");
    payload.append("Thumbnail", data.thumbnail);
    if (data.projectTag == null) throw new Error("ProjectTag is null");
    payload.append("ProjectTag", data.projectTag);
    payload.append("Color", data.color);
    return payload;
}

function constructUpdateProjectPayload(data: currentData): any {
    let uploadTags = [];
    for(let i = 0; i < data.tags.length; i++) {
        uploadTags.push(data.tags[i]);
    }
    uploadTags = Array.from(new Set(uploadTags));
    if (data.thumbnail == null) throw new Error("Thumbnail is null");
    if (data.projectTag == null) throw new Error("ProjectTag is null");
    return {
        Title: data.title,
        Tags: uploadTags,
        Markdown: data.markdown,
        Html: data.html,
        Thumbnail: data.thumbnail,
        ProjectTag: data.projectTag,
        Color: data.color,
    }
}

function constructPayload(data: currentData): any {
    if(data.isPost) {
        if(data.isEditing) {
            return constructUpdatePostPayload(data);
        }else{
            return constructCreatePostPayload(data);
        }
    }else if (data.isPost == false) {
        if(data.isEditing) {
            return constructUpdateProjectPayload(data);
        }else{
            return constructCreateProjectPayload(data);
        }
    }
}

// stuff for new tags
export let makeNewTag = writable(false);
export let newTagName = writable(null);
export let newTagIcon = writable(null);
export let newTagColor = writable(null);
export let showIcoImg = writable(false);
export let icoImg = writable();


export let file = writable(null);
export let imglink = writable(null);
export let showdialog = writable(false);
export let isProjTag = writable(false);
export let imgInput = writable();
export let image = writable();

export let curPage = persisted("curPage", "Posts");


export let pb = new PocketBase("https://db.shlokbhakta.dev");