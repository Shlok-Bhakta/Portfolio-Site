<script>
  import CardBody6 from "./CardBody6.svelte";
  export let title = "2d card";
  export let content = "placeholder lorem ipsum";
  export let colors = "#b4befe, #f2cdcd, #f5c2e7, #cba6f7, #f38ba8, #eba0ac, #fab387, #f9e2af, #a6e3a1, #94e2d5, #89dceb, #74c7ec, #89b4fa, #b4befe";
</script>
<style>
/* Keyframes for moving the gradient */
  @keyframes moveGradient {
    0% {
      background-position: 0% 0%;
    }
    100% {
      background-position: 100% 0%;
    }
  }
  .rainbow-shadow{

    transform: translate(0px, -14px);
    background-size: 500% 100%; /* Adjust background size as needed */
    background-position: 0% 0%;
    /* animation-delay: 2ms; */
    animation: moveGradient 10s linear infinite;
    z-index: -1;
  }
  
</style>

<div class="grid grid-flow-row">
  <div
  class="border border-base relative rounded-xl bg-mantle h-full w-full"
  >
  <CardBody6 class="p-8" title={title} desc={content}/>
</div>
<div class="bg-black h-5 rounded-xl rainbow-shadow" style="background-image: linear-gradient(45deg, {colors});"/>
</div>
