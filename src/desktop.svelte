<script lang="ts">
      import Window from './window.svelte';
</script>
  
<div class="root">
    <Window startPosition={{clientX: 100, clientY: 100}}>

    </Window>

    <Window startPosition={{clientX: 0, clientY: 0}}>

    </Window>
</div>
  
<style>
    .root {
        background-color: antiquewhite;
        width: 100vw;
        height: 100vh;
        position: relative;
    }
</style>
  