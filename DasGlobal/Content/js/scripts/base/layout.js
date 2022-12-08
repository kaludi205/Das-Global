class Layout extends Base {
    /**
     * @typedef {{
     *     name: String,
     *     link: String,
     *     icon: String,
     *     desc: String
     * }} layoutItem
     */

    /**
     *
     * @param modulo
     */
    constructor(modulo) {
        super();

        this.initComponents();

        this.fontStyle = 'style="font-size: 12px; "';
        this.iconItem = 'far fa-circle';

        this.url = location.pathname;
    }

    initComponents() {
        this.initEvents();
        this.generarNavs(true)
    }

    initEvents() {
        const self = this;

        $(document).ajaxError(function (event, error, settings) {
            if (error.status === 500) {
                console.log(error['responseJSON'].errors);
                self.swal2.errorMessage('Ha ocurrido un error en el Servidor.');
            } else if (error.status === 409 || error.status === 404) {
                self.swal2.errorMessage(error['responseJSON'].errors, error.status + '');
            } else if (error.status === 422) {
                console.log(error['responseJSON'].errors);
                const errors = error['responseJSON'].errors || [];
                const keys = Object.keys(errors);
                let mensajes = '';
                keys.forEach(key => {
                    mensajes += `<p style="font-size: 11px;">${errors[key]}</p>`;
                });
                self.swal2.errorMessage(mensajes, 422);
            }
        });
    }

    generarNavs() {


        /**
         *
         * @type {Array.<layoutItem>}
         */
        let navItems = [
            {
                name: 'Paises',
                link: 'Paises',
                icon: 'fas fa-globe-americas'
            },
            {
                name: 'Empresas',
                link: 'Empresas',
                icon: 'fas fa-building'
            },
            {
                name: 'Sucursales',
                link: 'Sucursales',
                icon: 'fas fa-project-diagram'
            },
            {
                name: 'Empleados',
                link: 'Empleados',
                icon: 'fas fa-users'
            }
        ];

        let navs = '';

        navItems.forEach(item => {
            navs += this.getNavItem(item);
        });

        $('#sideNavMenu').html(navs);

        $('[data-toggle="tooltip"]').tooltip({
            template: '<div class="tooltip md-tooltip label-sm"><div class="tooltip-arrow md-arrow"></div><div class="tooltip-inner md-inner"></div></div>',
            delay: {"show": 1000, "hide": 100}
        });

        return navs;
    }


    /**
     * Genera un nav-item
     * @param {layoutItem} item
     * @param effect
     * @returns {string}
     */
    getNavItem(item, effect = 'animated fadeInLeft') {
        item.icon = item.icon ? item.icon : this.iconItem;
        let active = this.url === `/${item.link}` ? 'active' : '';

        return `<li class="nav-item ${effect}">
                  <a data-toggle="tooltip" data-placement="top" data-html="true" title="${item.name}"  class="nav-link ${active} waves-effect waves-light" href="/${item.link}" ${this.fontStyle} >
                    <i class="nav-icon ${item.icon}"></i>
                        <p>${item.name}</p>
                    </a>
                </li>
            `;
    }

}

