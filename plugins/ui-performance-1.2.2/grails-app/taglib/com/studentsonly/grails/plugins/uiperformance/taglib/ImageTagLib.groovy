package com.studentsonly.grails.plugins.uiperformance.taglib

import com.studentsonly.grails.plugins.uiperformance.Utils

/**
 * Generates an &lt;img&gt; or &lt;input type="image"&gt; tag.
 * <p/>
 * The only required attribute is 'src', which is the relative path of the image
 * file ('/images/foo.gif' would specify src='foo.gif', '/images/foo/bar/z.jpg'
 * would specify src='foo/bar/z.jpg').
 * <p/>
 * 'name' is an optional attribute and defines both the name and id attributes if specified.
 * <p/>
 * 'border' is an optional attribute, defaulting to '0' if not provided.
 * <p/>
 * All other attributes are included at the end in the specified order.
 * <p/>
 * &lt;p:image src='foo.gif' alt='Foo' style='width: 200px'/&gt;
 * would generate this output:
 * &lt;img src='/yourapp/images/foo.gif' border='0' alt="Foo" style="width: 200px"/&gt;
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class ImageTagLib extends AbstractTaglib {

	static namespace = 'p'

	// dependency injection
	def imageTagPostProcessor

	/**
	 * Generates an &lt;img&gt; tag.
	 */
	def image = { attrs ->
		doImage attrs, 'img'
	}

	/**
	 * Generates an &lt;input type="image"&gt; tag.
	 */
	def inputImage = { attrs ->
		doImage attrs, "input type='image'"
	}

	def imageLink = { attrs ->

		if (!attrs.src) {
			throwTagError('Tag [imageLink] is missing required attribute [src]')
		}

		String link = generateRelativePath('images', attrs.remove('src'), '',
				attrs.remove('plugin'), attrs.remove('absolute'))

		link = "'$link'"
		if (imageTagPostProcessor) {
			link = imageTagPostProcessor.process(link, request)
		}

		out << link
	}

	def favicon = { attrs ->
		String src = attrs.remove('src')

		String ext = 'ico'
		if (src) {
			int index = src.lastIndexOf('.')
			if (index > -1) {
				ext = src.substring(index + 1)
			}
			else {
				src += '.ico'
			}
		}
		else {
			src = '/favicon.ico'
		}
		src = generateRelativePath(null, src, null, attrs.remove('plugin'), attrs.remove('absolute'))

		String rel = attrs.remove('rel') ?: 'icon'
		String type = ext == 'ico' ? 'vnd.microsoft.icon' : ext
		String html = "<link rel='$rel' href='${src}' type='image/$type'${generateExtraAttributes(attrs)}/>"

		if (imageTagPostProcessor) {
			html = imageTagPostProcessor.process(html, request)
		}
		out << html
	}

	private doImage = { attrs, tag ->

		if (!attrs.src) {
			throwTagError("Tag [$tag] is missing required attribute [src]")
		}

		String link = attrs.remove('src')

		// check if it's spriteable, and modify attrs if so
		// TODO  this should be done in the post processor
		String spriteClass = getSpriteClass(link)
		if (spriteClass) {
			link = generateRelativePath('images', 'spacer.gif', '', true, false)

			if (attrs.'class') {
				attrs.'class' += " $spriteClass"
			}
			else {
				attrs.'class' = spriteClass
			}
		}
		else {
			link = generateRelativePath('images', link, '', attrs.remove('plugin'), attrs.remove('absolute'))
		}

		String borderAttr = attrs.remove('border')
		int border = borderAttr ? Integer.parseInt(borderAttr) : 0

		String name = attrs.remove('name')
		String nameAndId = name ? "name='${name}' id='${name}' " : ''

		String html = "<$tag src='${link}' ${nameAndId}border='${border}'${generateExtraAttributes(attrs)}/>"
		if (imageTagPostProcessor) {
			html = imageTagPostProcessor.process(html, request)
		}
		out << html
	}

	/**
	 * If the images is included in a sprite bundle, get the
	 * appropriate sprite class.
	 * @param src  the image src
	 * @return the class or null
	 */
	private String getSpriteClass(String src) {
		 if (Utils.isEnabled() && Utils.isIncludedInSprite(src)) {
			 return src.substring(src.lastIndexOf('/') + 1, src.lastIndexOf('.')) + '_sprite'
		 }

		 return null
	}
}
