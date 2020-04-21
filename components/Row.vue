<template>
    <tr>
        <td v-for="(column, index) in columns">
            {{ rowData[column.field] }}
        </td>
    </tr>
</template>

<script>
    export default {
        name: 'SvTreeGridRow',
        props: {
            columns: {
                type: Array,
                required: true
            },

            rowData: {
                type: Object,
                required: true
            }
        }
    }
</script>