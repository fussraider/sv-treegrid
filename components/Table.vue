<template>
    <div class="sv-table-wrapper">
        <table class="sv-table">
            <thead>
            <slot></slot>
            </thead>

            <tbody>
            <sv-tree-grid-row
                    v-for="(row, index) in state.normalizedTable"
                    :index="index"
                    :row-data="row"
                    :state="state"
                    :namespace="namespace"
                    :key="'row-' + index"
            >
            </sv-tree-grid-row>
            </tbody>
        </table>
    </div>
</template>

<script>
    import store from '../store';
    import SvTreeGridRow from "./Row";

    export default {
        name: 'SvTreeGrid',
        components: {SvTreeGridRow},
        props: {
            items: {
                type: Array,
                required: false,
                default: []
            },

            collapsed: {
                type: Boolean,
                required: false,
                default: false
            },

            namespace: {
                type: String,
                required: false,
                default: 'sv-treegrid'
            }
        },

        created() {
            this.$store.registerModule(this.namespace, store)
        },

        beforeDestroy() {
            this.$store.unregisterModule(this.namespace)
        },

        mounted() {
            let columnsWrapper = this.$children.find(comp => comp.$options.name === 'SvTreeGridColumns');
            this.$store.commit(this.namespace + '/setKeyField', columnsWrapper.keyField);
            this.$store.commit(this.namespace + '/setColumns', columnsWrapper.$children);
            this.$store.commit(this.namespace + '/setCollapsed', this.collapsed);
            this.refreshTable();
        },

        methods: {
            refreshTable() {
                this.$store.dispatch(this.namespace + '/handleItemsList', this.items, this.collapsed);
            }
        },

        computed: {
            state() {
                return this.$store.state[this.namespace];
            },
        },

        watch: {
            items: {
                handler() {
                    if (this.state) {
                        this.refreshTable();
                    }
                },
                deep: true,
                immediate: true,
            }
        }
    }
</script>