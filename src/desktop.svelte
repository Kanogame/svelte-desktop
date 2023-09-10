<script lang="ts">
    import Window from './Window.svelte';
    import {Initialize} from "./api/start";
    import type {WindowContentData, Button, Text, WindowData} from "./utils/WindowTypes";
    import { DesktopStore } from './store/windowStore';
    import WindowContent from './WindowContent.svelte';
    import type {EventNewWindow} from "./utils/EventTypes";

    let zIndex: number = 1;

    function getZindex() {
    return zIndex++;
    }

    const socket = Initialize();

    socket.addEventListener("message", (e) => {
        console.log(e.data);
        const message = JSON.parse(e.data);
        switch (message.type) {
            case "event":
                EventManager(message.payload);
                break;
        }
    });

    function ResolveEvent(event: any) {
        // todo send resolve
    }

    function EventManager(data: EventNewWindow) {
        switch (data.event_type) {
            case "new_window": 
                DesktopStore.addWindow({id: getId(), content: data.payload.content});
        }
    }

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

    let id: number = 1;

    let InpId: string;

    function getId() {
        return id++;
    }

    function remove() {
        console.log(+InpId);
        DesktopStore.removeWindow(+InpId);
    }

    function add() {
        DesktopStore.addWindow({id: getId(), content: content});
    }

    function change() {
        let curwindow: WindowContentData = $DesktopStore.get(+InpId).content;
        curwindow.buttons.push({ id: 2,
            Position: {x: 70, y: 100},
            Height: 50,
            Width: 40,
            title: "testButton"});
        DesktopStore.changewindow(+InpId, curwindow);
    }
</script>
  
<div class="root">
    <button on:click={add}>add</button>
    <input type="text" bind:value={InpId}/>
    <button on:click={remove}>remove</button>
    <button on:click={change}>change</button>
    {#each [...$DesktopStore.values()] as window (window.id)}
    <Window StartPosition={{clientX: 100, clientY: 100}} StartWindowHeight={400} StartWindowWidth={200} isResizable={true} getZindex={getZindex} Content={window.content}/>
    {/each}
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
  