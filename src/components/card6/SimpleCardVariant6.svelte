<script>
  import CardBody6 from "./CardBody6.svelte";
</script>
<style>
/* Keyframes for moving the gradient */
  @keyframes moveGradient {
    0% {
      background-position: 0% 0%;
    }
    100% {
      background-position: 100% 100%;
    }
  }
  .rainbow-shadow{
    height: 50%;
    width: 100%;
    position: absolute;
    transform: translate(0px, calc(4px + 100%));
    background-image: linear-gradient(45deg, #b4befe, #f2cdcd, #f5c2e7, #cba6f7, #f38ba8, #eba0ac, #fab387, #f9e2af, #a6e3a1, #94e2d5, #89dceb, #74c7ec, #89b4fa, #b4befe);
    border-radius: 12px;
    background-size: 200% 200%; /* Adjust background size as needed */
    background-position: 0% 0%;
    animation: moveGradient 20s linear infinite;
  }
  
</style>

<div>
  <div class="rainbow-shadow">
  </div>
    <div
      class="border border-base relative rounded-xl bg-mantle h-full w-full overflow-hidden"
    >
    <CardBody6 class="p-8" />
    </div>
</div>
