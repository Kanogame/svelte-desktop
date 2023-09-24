<script lang="ts">
    import Window from './Window.svelte';
    import {Initialize} from "./api/start";
    import type {WindowContentData, Button, Text, WindowData} from "./utils/WindowTypes";
    import { DesktopStore } from './store/windowStore';
    import WindowContent from './WindowContent.svelte';
    import { EventButtonClick } from "./api/events";

    let zIndex: number = 1;

    function getZindex() {
    return zIndex++;
    }

    const {UUID, socket} = Initialize();

    socket.addEventListener("message", (e) => {
        console.log(e.data);
        const message = JSON.parse(e.data);
        switch (message.message_type) {
            case "event":
                EventManager(message.payload);
                break;
        }
    });

    function ResolveEvent(event: any) {
        // todo send resolve
    }

    function EventManager(data: any) {
        switch (data.event_type) {
            case "new_window": 
                console.log(data.payload.window_content);
                DesktopStore.addWindow({id: getId(), content: data.payload.window_content});
        }
    }

    function windowEventHandler(role: any) {
        const eventData = role.detail;
        switch (eventData.eventType) {
            case "buttonClick":
                EventButtonClick(socket, eventData.role, eventData.windowId, UUID);
                break;
        }
    }

    let id: number = 1;

    let InpId: string;

    function getId() {
        return id++;
    }

    function remove() {
        console.log(+InpId);
        DesktopStore.removeWindow(+InpId);
    }
    /*
    function change() {
        let curwindow: WindowContentData = $DesktopStore.get(+InpId).content;
        curwindow.buttons.push({ id: 2,
            Position: {x: 70, y: 100},
            Size: {height: 40,width: 50},
            title: "testButton"});
        DesktopStore.changewindow(+InpId, curwindow);
    }*/
</script>
  
<div class="root">
    <input type="text" bind:value={InpId}/>
    <button on:click={remove}>remove</button>
    {#each [...$DesktopStore.values()] as window (window.id)}
    <Window on:event={windowEventHandler} WindowId={window.id} StartPosition={{clientX: 100, clientY: 100}} StartWindowHeight={400} StartWindowWidth={200} isResizable={true} getZindex={getZindex} Content={window.content}/>
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
  