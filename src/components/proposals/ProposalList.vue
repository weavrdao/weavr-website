<template>
        <h2 class="title is-size-3">{{ proposalStatus }}</h2>
</template>

<script>
export default {
    name: "ProposalList",
    props: {
        proposalStatus: {
            type: String,
            required: true,
        }
    }
}
</script>