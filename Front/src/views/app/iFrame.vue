<script setup>
import { ref } from "vue";

const props = defineProps({
  url: String,
  id: String
});

let url = ref(props.url);
</script>

<template>
    <iframe :src="url" ></iframe>
</template>

<style>

iframe {
    width: 100%;
    height: 100%;
    border: none;
}

</style>