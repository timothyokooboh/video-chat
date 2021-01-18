<template>
    <input
        :value="value"
        @input="$emit('input', $event.target.value)"
        :style="{backgroundColor: bgColor, height}"
    >
</template>

<script>
export default {
    props: {
        value: null, // to allow any data type
        bgColor: String, 
        height: String
    }
}
</script>

<style lang="scss" scoped>
    input {
        width: 100%;
        border-radius: 10rem;
        outline: none;
        padding: 1rem 1.5rem;
        font-size: 1.4rem;
    }
</style>