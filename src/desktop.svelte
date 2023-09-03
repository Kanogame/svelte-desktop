<script lang="ts">
    import Window from './Window.svelte';
    import {Initialize} from "./api/start";
    import type {WindowContentData, Button, Text} from "./utils/Types";

    let zIndex: number = 1;

    function getZindex() {
    return zIndex++;
    }

    const socket = Initialize();

    socket.addEventListener("message", () => {
        
    });


    let content: WindowContentData = {
        buttons: [{
            id: 1,
            Position: {x: 20, y: 30},
            Height: 30,
            Width: 40,
            title: "testButton",
        }],
        blocks: [{
            id: 2,
            Position: {x: 50, y: 70},
            FontSize: 17,
            title: "testButton",
    }]
    };
</script>
  
<div class="root">
    <Window StartPosition={{clientX: 100, clientY: 100}} StartWindowHeight={400} StartWindowWidth={200} isResizable={true} getZindex={getZindex} Content={content}>

    </Window>

    <Window StartPosition={{clientX: 0, clientY: 0}} StartWindowHeight={200} StartWindowWidth={200} isResizable={false} getZindex={getZindex}>

    </Window>
</div>
  
<style>
    .root {
        background-image: url("./wallpaper.jpg");
        background-repeat: no-repeat;
        background-size:cover;
        background-position: 50%, 50%;
        width: 100vw;
        height: 100vh;
        position: relative;
    }
</style>
  