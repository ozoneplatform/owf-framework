package com.studentsonly.grails.plugins.uiperformance.taglib

/**
 * Taglib to display a sprite image.
 *
 * Create the sprite image containing multiple images and calculate the offsets to each image,
 * e.g. by using http://csssprites.com.
 *
 * Then define some classes in a css file:
 * 
 * .sprite1, .sprite2 {
 *    background-repeat: no-repeat;
 *    overflow: hidden;
 * }
 *
 * .sprite1 {
 *    background-image: url(../images/sprite1.gif);
 * }
 *
 * .sprite2 {
 *    background-image: url(../images/sprite2.gif);
 * }
 *
 * .foo_sprite {
 *    width: 27px;
 *    height: 24px;
 *    line-height: 24px;
 *    background-position: -50px -50px;
 * }
 *
 * .bar_sprite {
 *    width: 12px;
 *    height: 12px;
 *    line-height: 12px;
 *    background-position: -50px -174px;
 * }
 *
 * Make sure to declare the width, height, and line-height (same as height) for each image, as well as
 * the background-position, to allow the browser to render the proper region of the larger image.
 *
 * To use the taglib you need to specify the name of the sprite class and the class of the inner image.
 * The convention is to name sprite classes ".spriteXXX" and the CSS classes ".YYY_sprite", so you only
 * need to specify "XXX" and "YYY" in the tag declaration, e.g.
 *
 * <p:sprite sprite='1' image='foo'/>
 * 
 * or
 *
 * <p:sprite sprite='2' image='bar'/>
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class SpriteTagLib {

	static namespace = 'p'

	def sprite = { attrs, body ->
		attrs.src = 'spacer.gif'
		attrs.alt = ''
		attrs.plugin = true
		attrs.absolute = false
		attrs['class'] = 'sprite' + attrs.remove('sprite') + ' ' + attrs.remove('image') + '_sprite'
		out << p.image(attrs)
	}
}
