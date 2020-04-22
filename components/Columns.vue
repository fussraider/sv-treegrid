<template>
    <tr>
        <sv-treegrid-column v-if="keyField === null" title="" field="level"></sv-treegrid-column>
        <slot></slot>
    </tr>
</template>

<script>
    import Arrow from "./Offset";
    export default {
        components: {Arrow},
        name: 'SvTreeGridColumns',
        props: {
            keyField: {
                type: String,
                required: false,
                default: null
            }
        },

    }
</script>