<script>
    import { currentEdit, showImage, imageElement, pb } from "./stores";
    import { PreRendered } from "carta-md";
    import "../../styles/blog.css";
    import { onMount } from "svelte";
    let posts = $state(null);

    async function getProjects() {
      const data = await pb.collection("Projects").getOne($currentEdit.id);

      posts = await pb.collection("Posts").getFullList({
          filter: 'tagName ~ "' + data.ProjectTag + '"',
          expand: "tagName",
          sort: "-created",
      });

      for (let i = 0; i < posts.length; i++) {
          posts[i].imgurl = pb.files.getURL(posts[i], posts[i].Thumbnail);
      }
    }

    onMount(async () => {
        if ($currentEdit.isPost == false && $currentEdit.id) await getProjects();
    });

    const shortDate = (value) =>
        new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }).toLowerCase();
</script>

<div class="preview">
  <header class="article-header">
    <p class="article-meta">preview · {$currentEdit.isPost ? "post" : "project"}</p>
    <h1>{$currentEdit.title}</h1>
  </header>
  <figure class="article-hero">
    <img src={$showImage ? $imageElement : $currentEdit.thumbnail} alt={$currentEdit.title} />
  </figure>
  <article class="article-body">
    <PreRendered html={$currentEdit.html} />
  </article>

  <!-- related posts only show on projects -->
  {#if $currentEdit.isPost == false && posts != null && posts.length > 0}
    <section class="related-posts" aria-label="Related posts">
      <h2 class="display-title">Related<sup>{String(posts.length).padStart(2, "0")}</sup></h2>
      <ol>
        {#each posts as data}
          <li>
            <a class="related" href={"/post/" + data.id}>
              <img src={data.imgurl} alt="" />
              <span class="related-title">{data.Title}</span>
              <span class="related-date">{shortDate(data.created)}</span>
            </a>
          </li>
        {/each}
      </ol>
    </section>
  {/if}

  <footer class="article-footer">
    <p>Thanks for <span class="it">reading</span></p>
  </footer>
</div>

<style>
  .preview {
    padding-bottom: 2rem;
  }

  .related {
    display: grid;
    grid-template-columns: 160px 1fr auto;
    gap: 1.5rem;
    align-items: center;
    padding: 1rem 0;
  }

  .related img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border-radius: 10px;
  }

  .related-title {
    font-size: 1.4rem;
    font-weight: 600;
    letter-spacing: -0.04em;
    transition: color 160ms;
  }

  .related:hover .related-title {
    color: var(--accent);
  }

  .related-date {
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 0.72rem;
  }
</style>
