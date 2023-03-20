<template>
<footer class="container is-centered">
    <hr/>
    <div class="columns">
        <div class="column is-half">
            <h3>Explore</h3>
            <ul>
              <li>
                <a href="https://weavr-dao.gitbook.io/weavr-dao/faq/the-basics">FAQ</a>
              </li>
                <li>
                  <a href="https://blog.weavr.org/">Blog</a>
                </li>
                <li>
                  <a @click="() => { this.$router.push('/privacy') }">Privacy Policy</a>
                </li>
                <li>
                  <a @click="() => { this.$router.push('/toc') }">Terms and Conditions</a>
                </li>
            </ul>
        </div>
        <div class="column is-half">
            <h3>Impact</h3>
            <ul>
                <li>
                    <a href="https://forum.weavr.org/">Forum</a>
                </li>
                <li>
                    <a href="https://resolutions.weavr.org">Resolutions</a>
                </li>
              <li>
                <a href="https://weavr-dao.gitbook.io/weavr-dao/">Documentation</a>
              </li>
                <li>
                    <a href="https://discord.gg/ehEfjrcapk">Discord</a>
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
            <a href="https://twitter.com/WeavrDAO"> <unicon width="30" height="30" name="twitter" fill="white"></unicon></a>
            <a href="https://github.com/weavrdao"> <unicon width="30" height="30" name="github" fill="white"></unicon></a>
            <a href="https://discord.gg/ehEfjrcapk"> <unicon width="30" height="30" name="discord" fill="white"></unicon></a>
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
@import "../../../styles/weavr-custom.scss";

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