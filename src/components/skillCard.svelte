<script>
  import "../styles/global.css";
  import { prominent } from "color.js";

  // export a variable text to be used in the html
  export let title = "Not Webpack";
  export let image = "https://avatars.githubusercontent.com/u/2105791?s=48&v=4";
  export let text =
    "I am good at this right hered jkd gsse hs hjks hjk 7892 7892 7893 789 789";
  export let posts = "0";
  let c1 = "";
  let c2 = "";
  async function getColors() {
    const color = await prominent(image, { amount: 3 });
    if (color[0][0] == 0 && color[0][1] == 0 && color[0][2] == 0) {
      color.splice(0, 1);
    }
    c1 =
      "#" +
      color[0][0].toString(16) +
      color[0][1].toString(16) +
      color[0][2].toString(16);
    c2 =
      "#" +
      color[1][0].toString(16) +
      color[1][1].toString(16) +
      color[1][2].toString(16);
  }

  getColors();
</script>

<!-- <div class="bg-mantle flex flex-{allign} w-auto h-auto">
  <div>{title}</div>
  <img src={image} alt={title} class="w-24 h-24" />
  <div>{text}</div>
</div> -->

<div
  class="flex bg-gradient-to-br from-{c1} to-{c2} items-center justify-center w-dvw md:w-fit h-fit rounded-3xl"
>
  <div
    class="
        bg-mantle
        shadow-md
        m-0.5
        rounded-3xl
        flex
        justify-around
        items-center
        overflow-hidden
        flex-row w-dvw h-fit
        place-items-start max-h-full
        md:flex-col md:h-auto md:w-40
        md:max-h-96
      "
  >
    <img class="h-32 object-cover aspect-square" src={image} alt={title} />

    <div
      class="
          flex flex-col
          items-baseline
          justify-start
          pl-0
          md:pl-4
          p-4
          "
    >
      <div class="flex flex-col h-fit">
        <h1 class="text-lg font-normal mb-0 text-text font-sans">
          {title}
        </h1>
        <span class="text-xs text-indigo-300 mt-0">{posts} Posts</span>
      </div>
      <p class="text-xs text-subtext1 mb-3">{text}</p>
    </div>
  </div>
</div>
