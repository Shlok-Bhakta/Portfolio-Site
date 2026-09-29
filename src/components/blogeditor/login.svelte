<script>
    import { pb, auth, session } from "./stores";
    async function autoLogin(){
        try{
            $session = await pb.collection('_superusers').authWithPassword($auth.username, $auth.password);
            console.log("Auto login success");
        }catch(e){
            console.log("Could not auto login :(" + e);
        }
    }

    $effect(autoLogin);

    async function login() {
        try {
            $session = await pb.collection('_superusers').authWithPassword($auth.username, $auth.password);
        } catch (e) {
            console.log(e);
            $auth.username = "WRONG! BEGONE FROM MY BLOG!";
        }
    }
</script>

<form class="login" onsubmit={(event) => { event.preventDefault(); login(); }}>
    <p class="prompt"><b>~</b> $ sudo vim ~/notes</p>
    <h1 class="display-title">Sign in</h1>
    <label>
        <span>email</span>
        <input id="user" type="email" autocomplete="username" bind:value={$auth.username} />
    </label>
    <label>
        <span>password</span>
        <input type="password" autocomplete="current-password" bind:value={$auth.password} />
    </label>
    <button class="pill solid" type="submit">auth →</button>
</form>

<style>
    .login {
        width: min(100%, 420px);
        margin: clamp(2rem, 10vh, 6rem) auto 0;
        display: grid;
        gap: 1.1rem;
    }

    .prompt {
        margin: 0;
        color: var(--faint);
        font-family: var(--font-mono);
        font-size: 0.8rem;
    }

    .prompt b {
        color: var(--accent);
        font-weight: 400;
    }

    h1 {
        margin-bottom: 1.2rem;
        font-size: clamp(3.4rem, 10vw, 5.5rem);
    }

    label {
        display: grid;
        gap: 0.45rem;
    }

    label span {
        color: var(--muted);
        font-family: var(--font-mono);
        font-size: 0.75rem;
    }

    input {
        padding: 0.8rem 1rem;
        border: 1px solid var(--line-bright);
        border-radius: 12px;
        color: var(--paper);
        background: var(--ink-raised);
        font: inherit;
        outline: none;
        transition: border-color 160ms;
    }

    input:focus {
        border-color: var(--accent);
    }

    button {
        justify-self: start;
        margin-top: 0.6rem;
        cursor: pointer;
    }
</style>
