<script>
    import { currentEdit, showImage, imageElement, pb } from "./stores";
    import { PreRendered } from "carta-md";
    import "../../styles/blog.css";
    import { on } from "svelte/events";
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    let posts = $state(null); 
    async function getProjects() {
      const data = await pb.collection("Projects").getOne($currentEdit.id); 
      const image = pb.files.getUrl(data, data.Thumbnail);
  
      posts = await pb.collection("Posts").getFullList({
          filter: 'tagName ~ "' + data.ProjectTag + '"',
          expand: "tagName",
          sort: "-created",
      });
  
      for (let i = 0; i < posts.length; i++) {
          posts[i].imgurl = pb.files.getUrl(posts[i], posts[i].Thumbnail);
          posts[i].imgurllq = pb.files.getUrl(posts[i], posts[i].Thumbnail, {
              thumb: "16x9",
          });
          for (let j = 0; j < posts[i].expand?.tagName.length; j++) {
              posts[i].expand.tagName[j].imgurl = pb.files.getUrl(
                  posts[i].expand?.tagName[j],
                  posts[i].expand?.tagName[j].Icon,
              );
          }
      }

    }

    onMount(async () => {await getProjects()}); 

</script>



<style>
  .card {
      backdrop-filter: blur(5px) saturate(180%);
      -webkit-backdrop-filter: blur(5px) saturate(180%);
      background-color: #3132443f;
      border-radius: 12px;
      border:  1px solid;
  }
</style>

<div class="flex justify-center mt-4">
  <div class="card w-4/5 lg:w-2/4 p-1" style='border-color: {$currentEdit.color};'>
    {#if $showImage}
        <img class="aspect-auto w-full rouned-md" src={$imageElement} alt={$currentEdit.title} />
    {:else}
        <img class="aspect-auto w-full rouned-md" src={$currentEdit.thumbnail} alt={$currentEdit.title} />
    {/if}
  </div>
</div>
<div class="flex justify-center">
  <div class="title text-center text-text nerdfont">
    {$currentEdit.title}
  </div>
</div>
<div class="flex justify-center">
  <article
  class="flex w-full bg-mantle center flex-col justify-center nerdfont p-3 mx-8 rounded-md"
  >
    <PreRendered html={$currentEdit.html} />
  </article>
</div>
<!-- special posts section on projects page only -->
{#if $currentEdit.isPost == false && posts != null}
<div hidden={posts.length == 0}>
  <div class="title text-center text-text nerdfont">Posts</div>
  <div class="flex justify-center">
      <div
          class="flex w-[calc(100vw-40px)] bg-mantle center flex-col justify-center max-w-4xl nerdfont p-3 rounded-md text-text"
      >
          <ol
              class="grid grid-flow-row sm:grid-cols-1 md:grid-cols-3 gap-2"
          >
            {#each posts as data}
              <li>
                <a href={"/post/" + data.id}>
                <div
                  class="w-full h-full min-h-72 border-2 rounded-md p-2"
                  style="border-color: ${data.Color};"
                >
                  <img
                    src={data.imgurl}
                    alt={data.Title}
                    class="aspect-auto w-full max-w-96 mx-auto"
                  />


                  <div class="pr-2 text-sm text-text nerdfont">{data.Title}</div>
                  <div class="pr-2 text-sm text-blue nerdfont">{data.created}</div>
                  <!-- Tags -->
                  <ol class="flex flex-wrap space-x-1">
            {#each data.expand?.tagName as item}

              <li class="flex">
                <div
                  class="flex flex-row items-center space-x-2 rounded-full bg-surface0 border-[1px]"
                  style="border-color: ${item.color};">
                  <img class="pl-2 aspect-square h-8 w-8" src={item.imgurl} alt={item.tagName + " icon"} />
                  <div class="pr-2 text-sm text-text nerdfont">{item.tagName}</div>
                </div>
              </li>
            {/each}
          </ol>
        </div>
      </a>
    </li>
    {/each}
          </ol>
      </div>
  </div>
</div>
{/if}

<div>
  <img src="/ReadingThanks.svg" class="w-full px-6 pt-12 max:w-4xl" />
</div>

