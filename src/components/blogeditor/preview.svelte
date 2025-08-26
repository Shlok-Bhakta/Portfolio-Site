<script>
    import { currentEdit, showImage, imageElement, pb } from "./stores";
    import { PreRendered } from "carta-md";
    import GlassmorphicContainer from "../glassmorphism/GlassmorphicContainer.svelte";
    import "../../styles/blog.css";
    import { on } from "svelte/events";
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    let posts = $state(null);
    let globalColor = $state("#00ffd5");
    
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

    onMount(async () => {
        // Random color selection from Catppuccin palette
        let colors = ["#f38ba8", "#eba0ac", "#fab387", "#f9e2af", "#89dceb", "#cba6f7"];
        globalColor = colors[Math.floor(Math.random() * colors.length)];
        await getProjects();
    });

</script>



<div class="flex justify-center mt-4">
  <GlassmorphicContainer color={globalColor} text={$currentEdit.title} padding="2rem" title_offset="2rem" boxShadow={false}>
    <div class="flex flex-col items-center gap-6">
      {#if $showImage}
        <img class="aspect-auto w-full max-w-3xl" src={$imageElement} alt={$currentEdit.title} />
      {:else}
        <img class="aspect-auto w-full max-w-3xl" src={$currentEdit.thumbnail} alt={$currentEdit.title} />
      {/if}
      <article class="prose prose-invert max-w-none w-full">
        <PreRendered html={$currentEdit.html} />
      </article>
    </div>
  </GlassmorphicContainer>
</div>
<!-- special posts section on projects page only -->
{#if $currentEdit.isPost == false && posts != null}
<div hidden={posts.length == 0} class="mt-8">
  <div class="flex justify-center">
    <GlassmorphicContainer color={globalColor} text="Related Posts" padding="2rem" title_offset="2rem">
      <ol class="grid grid-flow-row sm:grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl">
        {#each posts as data}
          <li>
            <a href={"/post/" + data.id}>
              <div
                class="w-full h-full min-h-80 border-2 p-4 bg-mantle hover:bg-surface0 transition-colors"
                style="border-color: {data.Color};"
              >
                <div class="mb-4">
                  <img
                    src={data.imgurl}
                    alt={data.Title}
                    class="aspect-video w-full object-cover"
                  />
                </div>
                <div class="space-y-3">
                  <h3 class="text-lg font-semibold text-text nerdfont line-clamp-2">{data.Title}</h3>
                  <div class="text-sm text-blue nerdfont">
                    {new Date(data.created).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <!-- Tags -->
                  <div class="flex flex-wrap gap-2 mt-3">
                    {#each data.expand?.tagName as item}
                      <div
                        class="flex items-center gap-2 px-2 py-1 border bg-surface0 hover:bg-surface1 transition-colors w-fit"
                        style="border-color: {item.color}60;"
                      >
                        <img class="aspect-square h-4 w-4" src={item.imgurl} alt={item.tagName + " icon"} />
                        <span class="text-xs text-text nerdfont">{item.tagName}</span>
                      </div>
                    {/each}
                  </div>
                </div>
              </div>
            </a>
          </li>
        {/each}
      </ol>
    </GlassmorphicContainer>
  </div>
</div>
{/if}

<div class="md:w-4/5 max-w-6xl w-full px-4 md:px-0 mx-auto mt-8">
  <div class="flex justify-center">
    <img src="/ReadingThanks.svg" class="w-full max-w-lg opacity-80" />
  </div>
</div>

