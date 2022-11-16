<template>
<footer class="container is-centered">
    <hr/>
    <div class="columns">
        <!-- <div class="column is-third">
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
        </div> -->
        <div class="column is-half">
            <h3>Explore</h3>
            <ul>
                <li>
                    <a href="https://weavr-dao.gitbook.io/weavr-dao/">Documentation</a>
                </li>
                <li>
                    <a href="https://weavr-dao.gitbook.io/weavr-dao/faq/the-basics">FAQ</a>
                </li>
                <li>
                  <a href="https://weavr.org/#/privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="https://weavr.org/#/toc">Terms and Conditions</a>
                </li>
            </ul>
        </div>
        <div class="column is-half">
            <h3>Governance</h3>
            <ul>
                <li>
                    <a href="https://forum.weavr.org/">Forum</a>
                </li>
                <li>
                    <a href="https://app.weavr.org/#/weavr">Vote</a>
                </li>
                <li>
                    <a href="https://resolutions.weavr.org">Resolutions</a>
                </li>

                <li>
                    <a href="https://discord.gg/xFgHwqb3">Discord</a>
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
        <div class="is-flex is-flex-grow-0"> 
            <a href="https://twitter.com/WeavrDAO"> <unicon width="40" height="40" name="twitter" fill="white"></unicon></a>
            <a href="https://github.com/fractional-finance"> <unicon width="40" height="40" name="github" fill="white"></unicon></a>
            <a href="https://discord.gg/xFgHwqb3"> <unicon width="40" height="40" name="discord" fill="white"></unicon></a>
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