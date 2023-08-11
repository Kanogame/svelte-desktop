<script lang="ts">
      import Window from './window.svelte';
</script>
  
<div class="root">
    <Window startPosition={{clientX: 100, clientY: 100}} StartWindowHeight={400} StartWindowWidth={200} isResizable={true}>

    </Window>

    <Window startPosition={{clientX: 0, clientY: 0}} StartWindowHeight={200} StartWindowWidth={200} isResizable={false}>

    </Window>
</div>
  
<style>
    .root {
        background-image: url("./wallpaper.jpg");
        background-repeat: no-repeat;
        background-size:cover;
        width: 100vw;
        height: 100vh;
        position: relative;
    }
</style>
  