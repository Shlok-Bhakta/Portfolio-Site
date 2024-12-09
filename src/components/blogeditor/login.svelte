<script>
    import { pb, auth, session } from "./stores";
    async function autoLogin(){
        try{
            $session = await pb.admins.authWithPassword($auth.username, $auth.password);
        }catch(e){
            console.log("Could not auto login :(" + e);
        }
    }

    $effect(autoLogin);
    
    async function login() {
        try {
            $session = await pb.admins.authWithPassword($auth.username, $auth.password);
        } catch (e) {
            console.log(e);
            $auth.username = "WRONG! BEGONE FROM MY BLOG!";
        }
    }
</script>

<div class="flex justify-center">
    <div class="flex flex-col space-y-3 w-96">
        <input class="w-full border-2 rounded-md" id="user" type="email" bind:value={$auth.username} />
        <input class="w-full border-2 rounded-md" type="password" bind:value={$auth.password} />
        <button class="text-text border-2 rounded-md bg-mantle" onclick={login}>auth</button>
    </div>
</div>