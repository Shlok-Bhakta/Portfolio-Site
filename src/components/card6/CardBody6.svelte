<script>
  import { cn } from "./utils.ts";

  let card = {
    title: "3D Card",
    desc: "Don't take above two words seriously, I just made them up.",
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
