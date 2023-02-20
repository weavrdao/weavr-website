<template>
    <div class="card">
        <div class="logo-container"><img class="logo" src="/logo.svg"/></div>
        <div class="details-container">
            <h1 class="title">Weavr Blog</h1>
            <p>Your source of insight on the Weavr protocol and DAO</p>
        </div>
    </div>
  </template>
<style scoped lang="scss">
.card {
  display: flex;
  align-items: center;
  gap: 1rem;
  overflow: hidden;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.25);
  width: 100%;
  min-height: 7rem;
  max-width: 50rem;
  margin: 1rem auto;
  padding: 1rem;
}

.logo-container {
    display: grid;
    place-items: center;
    background: var(--vp-c-white);
    width: 3.5rem;
    height: 3.5rem;
    border: 4px solid var(--vp-c-brand);
    border-radius: 1000px;

    img {
        height: 2rem;
        width: 2rem;
    }
}

.details-container {
    margin-left: 10px;
    h1 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 0.3rem;
    }
}

@media screen and (max-width: 550px) {
    .card {
        flex-direction: column;
    }

    .details-container > * {
        text-align: center;
    }
}

</style>