declare( 'Ext::ux::api::gMap', function (use,checkState,__PACKAGE__) {
    
    use (
        {
            name : 'google.loader',
            URL : 'http://www.google.com/jsapi?key=ABQIAAAAa2oCDn-vJ2FYnkpuhajy_BS9yBCnMGgVgz1wX_5ao2cwasBFPhSlbobNhHLrLC3nOZOJ3h8FhZZnwQ',
            evalStr : 'google.load'
        },
        
        function(use, checkState){
            
            google.load('maps','2',{
                callback : function (){
                    
                    /**
					 * Helper package for smart pre-loading of Google Maps API. <br>
					 * It allows you to pre-load Google Maps while the user is examining the initial screen.
					 * <br>This package provides no configuration options and you should hardcode your GMap Api key into its body.
					 * <br>After this package finishes the loading, <b>google.maps</b> namespace is also available under shortcuts: 
					 * <b>Ext.ux.api.gMap</b> and <b>GM</b> 
					 * <br>Take a look at the demo code for further details. 
					 * <br>Intensively based on : <a href="http://extjs.com/learn/JScout">jScout</a>
					 * <br><br>Demo link: <a href="http://extjs-ux.org/repo/authors/SamuraiJack/trunk/Ext/ux/api/gMap/demo.html">http://extjs-ux.org/repo/authors/SamuraiJack/trunk/Ext/ux/api/gMap/demo.html</a>
					 * <br><br>Forum thread: <a href="http://extjs.com/forum/showthread.php?t=46715">http://extjs.com/forum/showthread.php?t=46715</a>
					 * @class Ext.ux.api.gMap
					 * @author Nickolay Platonov aka Samurai Jack
					 * @license <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0</a>
					 * @version 0.1
					 */
                    Ext.ux.api.gMap = GM = google.maps;
                    checkState();
                }
            });
            
            use({
                name : 'google.maps',
                evalStr : 'Ext.ux.api.gMap',
                externalLoading : true
            });
        }
    ); //eof use    
    
}); //eof declare



