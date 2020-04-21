<template>
    <tbody>
    <template v-for="(row, index) in rowsData">

        <sv-tree-grid-row
            :row-data="row"
            :columns="columns"
        >
        </sv-tree-grid-row>

        <template v-if="row.hasOwnProperty('children')">
            <sv-tree-grid-rows
                    :columns="columns"
                    :rows-data="row.children"
            ></sv-tree-grid-rows>
        </template>

    </template>


    </tbody>
</template>

<script>
    import SvTreeGridRow from './Row';

    export default {
        name: 'SvTreeGridRows',
        components: {SvTreeGridRow},
        props: {
            columns: {
                type: Array,
                required: true
            },

            rowsData: {
                type: Array,
                required: true
            }
        }
    }
</script>