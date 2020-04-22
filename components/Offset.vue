<template>
    <span class="sv-table-arrow-wrapper" :style="style">
        <button
                v-if="withArrow"
                class="sv-table-arrow-button"
                @click.prevent="executeCallback"
        >
            <i class="sv-table-arrow-icon" :class="iconClass"></i>
        </button>
    </span>
</template>

<script>
    export default {
        name: "SvTreeGridOffset",
        props: {
            value: {
                type: Number,
                required: false,
                default: 0
            },

            collapsed: {
                type: Boolean,
                required: true
            },

            callback: {
                type: Function,
                required: true
            },

            withArrow: {
                type: Boolean,
                required: true
            }
        },

        methods: {
            executeCallback() {
                this.callback();
            }
        },

        computed: {
            iconClass() {
                return this.collapsed ? 'sv-table-arrow-icon__right' : 'sv-table-arrow-icon__down';
            },

            style() {
                let padding = 15 * this.value + (this.withArrow ? 0 : 16);
                return {
                    paddingLeft: padding + 'px'
                }
            }
        }
    }
</script>