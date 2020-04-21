<template>
    <div class="sv-table-wrapper">
        <table class="sv-table">
            <thead>
                <slot></slot>
            </thead>
            <sv-tree-grid-rows
                :columns="columns"
                :rows-data="tree"
            ></sv-tree-grid-rows>
        </table>
    </div>
</template>

<script>
    import SvTreeGridRows from "./Rows";
    export default {
        name: 'SvTreeGrid',
        components: {SvTreeGridRows},
        props: {
            items: {
                type: Array,
                required: false,
                default: []
            }
        },
        data() {
            return {
                columns: [],
            }
        },

        mounted() {
            this.columns = this.$children.find(comp => comp.$options.name === 'SvTreeGridColumns').$children
        },

        computed: {
            tree() {
                if (this.items.length === 0) {
                    return []
                } else {
                    const map = new Map(this.items.map(item => [item.id, item]));

                    for (let item of map.values()) {
                        if (!map.has(item.parent_id)) {
                            continue;
                        }

                        const parent = map.get(item.parent_id);
                        parent.children = [...parent.children || [], item];
                    }

                    return [...map.values()].filter(item => !item.parent_id);
                }
            }
        }
    }
</script>