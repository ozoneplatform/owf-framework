Ext.override(Ext.tip.QuickTip, {

    onTargetOver : function(e){
        var me = this,
            target = e.getTarget(),
            elTarget,
            cfg,
            ns,
            tipConfig,
            autoHide;

        if (me.disabled) {
            return;
        }

        
        
        
        me.targetXY = e.getXY();

        if(!target || target.nodeType !== 1 || target == document || target == document.body){
            return;
        }

        // PATCH BEGIN
        // fixes a bug in Ext where if both parent and children have quick tips, only parent's will show

        // if (me.activeTarget && ((target == me.activeTarget.el) || Ext.fly(me.activeTarget.el).contains(target))) {
        //     me.clearTimer('hide');
        //     me.show();
        //     return;
        // }

        // PATCH BEGIN

        if (target) {
            Ext.Object.each(me.targets, function(key, value) {
                var targetEl = Ext.fly(value.target);
                if (targetEl && (targetEl.dom === target || targetEl.contains(target))) {
                    elTarget = targetEl.dom;
                    return false;
                }
            });
            if (elTarget) {
                me.activeTarget = me.targets[elTarget.id];
                me.activeTarget.el = target;
                me.anchor = me.activeTarget.anchor;
                if (me.anchor) {
                    me.anchorTarget = target;
                }
                me.delayShow();
                return;
            }
        }

        elTarget = Ext.get(target);
        cfg = me.tagConfig;
        ns = cfg.namespace;
        tipConfig = me.getTipCfg(e);

        if (tipConfig) {

            
            
            if (tipConfig.target) {
                target = tipConfig.target;
                elTarget = Ext.get(target);
            }
            autoHide = elTarget.getAttribute(ns + cfg.hide);

            me.activeTarget = {
                el: target,
                text: tipConfig.text,
                width: +elTarget.getAttribute(ns + cfg.width) || null,
                autoHide: autoHide != "user" && autoHide !== 'false',
                title: elTarget.getAttribute(ns + cfg.title),
                cls: elTarget.getAttribute(ns + cfg.cls),
                align: elTarget.getAttribute(ns + cfg.align)

            };
            me.anchor = elTarget.getAttribute(ns + cfg.anchor);
            if (me.anchor) {
                me.anchorTarget = target;
            }
            me.delayShow();
        }
    }

});
