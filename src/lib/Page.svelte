<script lang="ts">
    import Description from "./Description.svelte";
    import type { Config } from '$lib/types';

    export let config: Config;

    let innerWidth = 0;

    let email = "";
    let sent = false;
    let isLoading = false;
    let error = "";
    const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const sendEmail = async (emailToSend: string) => {
        error = "";
        if (!isValidEmail(emailToSend)) {
            error = "Sorry, that email is invalid."
            return;
        }
        isLoading = true;
        try {
            // await fetch("https://reviewedbyapi-production.up.railway.app/email", {
            await fetch("https://reviewedbyapi-production.up.railway.app/email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: emailToSend.toLowerCase()
                })
            });
        } catch {
            error = "Please try again later."
            return;
        } finally {
            isLoading = false;
        }
        email = "";
        sent = true;
    }

    $: {
        if (sent === true && email !== "") {
            sent = false;
        }
    }

</script>

<svelte:window bind:innerWidth />

<main class="container" >
    <div class="sidebar">
        <div class="logo_container">
            <img class="logo" src="/logo-light.svg" alt="img" />
            <p class="text title">ReviewedBy</p>
        </div>
        <div class="inner_container">
            <div style="overflow: auto">
                <h1 class="text">{config.title}</h1>
                <input bind:value={email} class="input" type="text" placeholder="enter email..." />
                <div class="error">{error}</div>
                <div class="text_container">
                    {#if sent}
                        <div>You will receive an email within 5 minutes</div>
                    {:else if isLoading}
                        <img class="spinner" src={'/spinner.svg'} alt="spinner" />
                    {:else }
                        <button on:click={() => sendEmail(email)} class="button">Get me a Job</button>
                    {/if}
                </div>
                <div class="line" />
                <Description title={config.record.title} tag={config.record.tag} icon={'/camera.svg'} />
                <Description title={config.feedback.title} tag={config.feedback.tag} icon={'/form.svg'} />
                <Description title={config.job.title} tag={config.job.tag} icon={'/heart.svg'} />
            </div>
        </div>
    </div>
    <div class="hero_image_container">
        <img class="hero_image" src={config.heroImage} alt="coder">
        <img class="lines" src={'/lines.svg'} alt="lines" />
    </div>
</main>

<style>
    .logo {
        height: 20px;
        width: 20px;
    }
    .logo_container {
        display: flex;
        align-items: center;
    }
    .title {
        margin-left: 5px;
        font-size: 18px;
        font-weight: 800;
    }
    .text_container {
        height: 60px;
        display: flex;
        align-items: center;
    }
    .error {
        color: #FF8B8B;
    }
    .spinner {
        margin-left: 45px;
    }
    @media (max-width: 550px) {
        .hero_image_container {
            display: none;
        }
    }
    .lines {
        position: absolute;
        left: -30%;
        bottom: 0;
        z-index: 1;
    }
    .inner_container {
        margin-top: 5%;
        padding-bottom: 15%;
    }
    .input {
        width: 80%;
        height: 40px;
        border-radius: 8px;
        padding: 0 10px;
        border: 1px solid rgba(47, 72, 88, 0.3);
    }
    .input:focus {
        outline: none;
    }
    .button {
        background-color: var(--secondary);
        color: var(--primary);
        border: none;
        cursor: pointer;
        height: 40px;
        padding: 0 30px;
        border-radius: 8px;
        font-size: 16px;
    }
    h1 {
        font-size: 3.5em;
    }
    .text {
        color: var(--secondary);
    }
    .line {
        width: 90%;
        height: 1px;
        background-color: var(--secondary);
        margin-top: 30px;
    }
    .container {
        width: 100vw;
        height: 100vh;
        display: flex;
        background-color: var(--bg-colour);
    }
    .sidebar {
        width: 34%;
        margin: 30px 6% 4% 4%;
        min-width: 400px;
        position: relative;
        padding-bottom: 100px;
    }

    .hero_image_container {
        width: 66%;
        height: 100%;
        position: relative;
    }
    .hero_image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 2;
        position: relative;
    }
</style>
