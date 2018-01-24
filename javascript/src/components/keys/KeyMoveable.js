/*
 * This plugin is designed to allow windows and
 * other floating components to the repositioned with
 * the keyboard.  This plugin does not itself handle
 * the keybinding, but exposes functions that the 
 * key bindings can use ot move the window
 */
Ext.define('Ozone.components.keys.KeyMoveable', {
    extend: 'Ext.AbstractPlugin', 

    init: function(cmp) {
        var moveAmount = this.moveAmount || Ozone.components.keys.KeyMoveable.prototype.moveAmount;

        cmp.moveUp = function() {
            var position = this.getPosition(),
                y = position[1] - moveAmount;

            position[1] = y > 0 ? y : 0;
            this.setPosition(position);
        };

        cmp.moveDown = function(bottomHeight) {
            var max = bottomHeight - this.getHeight(),
                position = this.getPosition(),
                y = position[1] + moveAmount;

            position[1] = y > max ? max : y;
            this.setPosition(position);
        };

        cmp.moveLeft = function() {
            var position = this.getPosition(),
                x = position[0] - moveAmount;

            position[0] = x > 0 ? x : 0;
            this.setPosition(position);
        };

        cmp.moveRight = function(rightWidth) {
            var max = rightWidth- this.getWidth(),
                position = this.getPosition(),
                x = position[0] + moveAmount;

            position[0] = x > max ? max : x;
            this.setPosition(position);
        };
    }
});

Ozone.components.keys.KeyMoveable.prototype.moveAmount = 10;
