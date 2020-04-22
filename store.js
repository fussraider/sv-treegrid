const state = () => {
    return {
        keyField: null,
        columns: [],
        lookupTable: {},
        normalizedTable: [],
        collapsed: false,
        currentRow: {},
        currentRowEdit: false,

        events: {}
    }
};
const mutations = {
    setKeyField: (state, payload) => state.keyField = payload,
    setColumns: (state, payload) => state.columns = payload,
    setLookupTable: (state, payload) => state.lookupTable = payload,
    setNormalizedTable: (state, payload) => state.normalizedTable = payload,
    setCollapsed: (state, payload) => state.collapsed = payload,
    setCollapsedInLookupTableById: (state, payload) => state.lookupTable[payload.id].collapsed = payload.value,
    setCurrentRow: (state, payload) => state.currentRow = payload,
    setCurrentRowEdit: (state, payload) => state.currentRowEdit = payload,
    setEventClosure: (state, payload) => state.events[payload.name] = payload.function,
};

const actions = {

    handleItemsList({commit, dispatch}, items) {
        dispatch('generateLookupTable', items)
            .then(() => {
                dispatch('generateNormalizedTable');
            })
    },

    generateLookupTable({commit, state}, items) {
        let result = {};
        items.forEach(item => {
            let parent_id = Number(item.parent_id);
            item.order = Number(item.order)
            if (typeof result[parent_id] === 'undefined') {
                result[parent_id] = {
                    collapsed: state.collapsed,
                    items: []
                };
            }

            if (typeof result[item.id] !== 'undefined' && typeof result[item.id].parent === 'undefined') {
                result[item.id].parent = parent_id;
            }

            result[parent_id].items.push(item);
        });

        commit('setLookupTable', result);
    },

    generateNormalizedTable({state, commit}) {
        let result = [];

        const normalize = (key, level) => {
            if (typeof state.lookupTable[key] !== 'undefined') {
                state.lookupTable[key].items.forEach(el => {
                    result.push({...el, level: level});
                    normalize(el.id, level + 1);
                })
            }
        }

        normalize(0, 0);

        commit('setNormalizedTable', result);
    },

    setCollapsedInLookupTableById({commit}, payload) {
        return commit('setCollapsedInLookupTableById', payload);
    },

    setCurrentRow({commit, state}, row) {
        if(typeof state.currentRow.id === 'undefined' || row.id !== state.currentRow.id) {
            commit('setCurrentRowEdit', false);
        }
        commit('setCurrentRow', row);
    },

    setCurrentRowEdit({commit, dispatch, state}, value) {
        if(value) {
            dispatch('onRowEditBefore', state.currentRow)
                .then(() => {
                    commit('setCurrentRowEdit', value);
                    dispatch('onRowEditAfter', state.currentRow)
                })
        } else {
            commit('setCurrentRowEdit', value);
        }
    },

    /**
     * @example: payload = {id: 1, value: false}
     */
    toggleRowById({state, commit, dispatch}, payload) {
        if (typeof state.lookupTable[payload.id] !== 'undefined') {
            dispatch('setCollapsedInLookupTableById', payload)
                .then(() => {
                    if (payload.value) {
                        state.lookupTable[payload.id].items.forEach(item => {
                            dispatch('toggleRowById', {
                                id: item.id,
                                value: payload.value
                            });
                        });
                    }
                })
        }
    },


    closureAction({state}, payload) {
        if (typeof state.events[payload.eventName] === 'function') {
            state.events[payload.eventName](payload.data);
        }
    },

    /***********************
     *  row event actions  *
     **********************/

    onRowSelect: ({state, dispatch}, row) => {
        dispatch('setCurrentRow', row)
            .then(() => {
                dispatch('closureAction', {
                    eventName: 'onRowSelect',
                    data: row
                })
            })
    },

    onRowToggleEdit: ({state, dispatch, commit}, row) => {
        dispatch('setCurrentRowEdit', !state.currentRowEdit);
        dispatch('closureAction', {
            eventName: 'onRowToggleEdit',
            data: row
        })
    },

    onRowEditBefore: ({dispatch}, row) => {
        dispatch('closureAction', {
            eventName: 'onRowEditBefore',
            data: row
        })
    },

    onRowEditAfter: ({dispatch}, row) => {
        dispatch('closureAction', {
            eventName: 'onRowEditAfter',
            data: row
        })
    },

    onRowSave: ({dispatch}, row) => {
        dispatch('closureAction', {
            eventName: 'onRowSave',
            data: row
        })
    }
};

export default {
    state,
    mutations,
    actions,
    namespaced: true,
}
