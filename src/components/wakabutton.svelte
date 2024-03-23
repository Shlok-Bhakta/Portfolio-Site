<script>
  let x = 0;
  let y = 0;
  console.log("locked and loaded");
  function yPlusAValue(value) {
    return value + y;
  }

  $: total = yPlusAValue(x);
</script>

Total: {total}
<button on:click={() => x++} class="text-text"> Increment X </button>

<button on:click={() => y++}> Increment Y </button>
