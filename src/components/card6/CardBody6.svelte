<script lang="ts">
  import { cn } from "./utils.ts";


  interface Props {
    title?: string;
    desc?: string;
    class?: string;
  }
  
  
  let { title = "3D Card", desc = "Don't take above two words seriously, I just made them up.", class: className = "p-8 h-full w-full nerdfont" }: Props = $props();
  let card = {
    title: title,
    desc: desc,
  };
  
</script>

<div class={cn("text-left", className)}>
  <h3 class="text-lg mb-1 font-bold text-text h-full w-full">
    {card.title}
  </h3>
  <p class="text-text h-full w-full">
    {card.desc}
  </p>
</div>
