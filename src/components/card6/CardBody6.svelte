<script>
  import { cn } from "./utils.ts";

  export let title = "3D Card";
  export let desc = "Don't take above two words seriously, I just made them up."

  let card = {
    title: title,
    desc: desc,
  };
  let className = "p-8 h-full w-full nerdfont";
  export { className as class };
</script>

<div class={cn("text-left", className)}>
  <h3 class="text-lg mb-1 font-bold text-text h-full w-full">
    {card.title}
  </h3>
  <p class="text-text h-full w-full">
    {card.desc}
  </p>
</div>
