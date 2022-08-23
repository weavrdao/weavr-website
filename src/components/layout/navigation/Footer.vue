<template>
<footer class="container is-centered">
    <hr/>
    <div class="columns">
        <div class="column is-third">
            <h3>Pages</h3>
            <ul>
                <li>
                    <a href="">My Assets</a>
                </li>
                <li>
                    <a href="">Threads</a>
                </li>
                <li>
                    <a href="">Needles</a>
                </li>
            </ul>
        </div>
        <div class="column is-third">
            <h3>Explore</h3>
            <ul>
                <li>
                    <a href="">Whitepaper</a>
                </li>
                <li>
                    <a href="">FAQ</a>
                </li>
            </ul>
        </div>
        <div class="column is-third">
            <h3>Governance</h3>
            <ul>
                <li>
                    <a href="">Forum</a>
                </li>
                <li>
                    <a href="">Vote</a>
                </li>
                <li>
                    <a href="">Proposals</a>
                </li>
                <li>
                    <a href="">Discord</a>
                </li>
            </ul>
        </div>
    </div>
    <hr/>
    <div class="is-flex is-justify-content-space-between">
        <div class="is-flex is-align-items-center">
            <img class="logo" src="../../../assets/logo/new-logo-white.svg" alt="WEAVR logo" />
            <h3 class="my-0">Weavr</h3>
        </div>
        <div class="is-flex socials-container">
            <a href="https://twitter.com/WeavrDAO"><img src="../../../assets/logo/3rd-party/twitter/twitter-blue.svg" alt=""></a>
            <a href="https://github.com/fractional-finance"><img src="../../../assets/logo/3rd-party/github/github-blue.svg" alt=""></a>
            <a href="https://discord.gg/xFgHwqb3"><img src="../../../assets/logo/3rd-party/discord/discord-blue.svg" alt=""></a>
        </div>
    </div>
</footer>
</template>

<script>
export default {
    name: "Footer",
}
</script>

<style lang="scss" scoped>
@import "../../../styles/frabric-custom.scss";

hr {
    height: 1px;
    background-color: $lightBlue;
    margin: 20px -20px;
}

.logo {
    height: 2rem;
    margin: 0 10px;
}

.socials-container {
    img {
        margin: 0 10px;
        height: 1.8rem;
    }
}
.container {
    color: white;
    margin: 20px auto 50px auto;
    padding: 0 20px;
    h3 {
        font-size: 1.6rem;
        font-weight: 500;
        margin-bottom: 2rem;
    }

    li {
        margin-bottom: 0.8rem;
    }

    a {
        color: $lightGray;
        &:hover {
            color: white;
        }
    }
}
</style>