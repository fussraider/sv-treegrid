<template>
    <tr v-show="isVisible">
        <td
                v-for="(column, index) in state.columns"
                :class="getColumnClassName(column)"
        >
            <template v-if="column.field === 'level'">
                <sv-tree-grid-offset
                        :value="rowData[column.field]"
                        :withArrow="withChildren"
                        :collapsed="isCollapsed"
                        :callback="toggleRow"
                ></sv-tree-grid-offset>
            </template>

            <template v-else>
                <sv-tree-grid-offset
                        v-if="column.field === state.keyField"
                        :value="rowData.level"
                        :withArrow="withChildren"
                        :collapsed="isCollapsed"
                        :callback="toggleRow"
                ></sv-tree-grid-offset>

                {{ rowData[column.field] }}
            </template>
        </td>
    </tr>
</template>

<script>
    import SvTreeGridOffset from "./Offset";

    export default {
        components: {SvTreeGridOffset},
        name: 'SvTreeGridRow',
        props: {
            rowData: {
                type: Object,
                required: true
            },

            index: {
                type: Number,
                required: true
            },

            state: {
                type: Object,
                required: true
            },

            namespace: {
                type: String,
                required: true
            }
        },

        methods: {
            toggleRow() {
                this.$store.dispatch(this.namespace + '/toggleRowById', {
                    id: this.rowData.id,
                    value: !this.isCollapsed
                });
            },

            getColumnClassName(column) {
                if (typeof column.field === 'string') {
                    return 'field-' + column.field
                        .replace(/([a-z])([A-Z])/g, '$1-$2')
                        .replace(/[\s_]+/g, '-')
                        .toLowerCase()
                } else {
                    return ''
                }
            }
        },

        computed: {
            withChildren() {
                return typeof this.state.lookupTable[this.rowData.id] !== 'undefined';
            },

            isCollapsed() {
                if (this.withChildren) {
                    return this.state.lookupTable[this.rowData.id].collapsed
                } else {
                    return false
                }
            },

            isVisible() {
                if (this.rowData.parent_id > 0) {
                    if (typeof this.state.lookupTable[this.rowData.parent_id] !== 'undefined') {
                        return !this.state.lookupTable[this.rowData.parent_id].collapsed;
                    } else {
                        return true
                    }
                } else {
                    return true;
                }
            }
        }

    }
</script>