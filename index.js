import Table from "./components/Table";
import Column from "./components/Column";
import Columns from "./components/Columns";

export default {
    install(Vue, options) {
        import("./styles/style.scss");
        Vue.component('sv-treegrid', Table);
        Vue.component('sv-treegrid-columns', Columns);
        Vue.component('sv-treegrid-column', Column);
    }
}