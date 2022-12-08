class BaseContext {
    /**
     *
     * @param {Base} context
     */
    constructor(context) {

        this.context = context;
        this.swal2 = context.swal2;
        this.util = context.util;
    }

}