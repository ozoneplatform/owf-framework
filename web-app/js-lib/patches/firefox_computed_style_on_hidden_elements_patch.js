        //hack to fix bug with FF
        //http://www.sencha.com/forum/showthread.php?132187-Issue-with-the-computed-style-on-hidden-elements-using-Firefox-and-Ext-JS-4&p=607608
        if ( Ext.supports.tests != null && Ext.isGecko ) {
          var tests = Ext.supports.tests;
          for (var i = 0 ; i < tests.length ; i++) {
            if (tests[i].identity == 'RightMargin') {
                tests[i].fn = function(doc, div) {
                        var view = doc.body.defaultView;
                        return !(view && view.getComputedStyle(div.firstChild.firstChild, null).marginRight != '0px');
                    };
            }
            else if (tests[i].identity == 'TransparentColor') {
                  tests[i].fn = function(doc, div, view) {
                        view = doc.body.defaultView;
                        return !(view && view.getComputedStyle(div.lastChild, null).backgroundColor != 'transparent');
                    }

              }
          }
        }
