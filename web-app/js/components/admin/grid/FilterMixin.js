Ext.define('Ozone.components.admin.grid.FilterMixin', {
    applyFilter: function (filterText, fields) {
        if (filterText) {
            var filters = [];
            for (var i = 0; i < fields.length; i++) {
                filters.push({
                    filterField: fields[i],
                    filterValue: filterText
                });
            }
            this.store.proxy.extraParams = Ext.apply(this.store.proxy.extraParams, {
                filters: Ext.JSON.encode(filters),
                filterOperator: 'OR'
            });
        } else {
            delete this.store.proxy.extraParams.filters;
            delete this.store.proxy.extraParams.filterOperator;
        }

        if (this.baseParams) {
            this.setBaseParams(this.baseParams);
        }

        this.store.loadPage(1, {
            params: {
                offset: 0,
                max: this.pageSize
            }
        });

    },

    clearFilter: function () {
        delete this.store.proxy.extraParams.filters;
        delete this.store.proxy.extraParams.filterOperator;

        if (this.baseParams) {
            this.setBaseParams(this.baseParams);
        }
        this.store.load({
            params: {
                start: 0,
                max: this.pageSize
            }
        });
    }
});

