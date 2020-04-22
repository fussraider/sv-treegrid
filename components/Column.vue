<template>
    <th>{{ title }}</th>
</template>

<script>
    export default {
        name: 'SvTreeGridColumn',
        props: {
            title: {
                type: String,
                required: false,
            },
            field: {
                required: true
            },
        }
    }
</script>