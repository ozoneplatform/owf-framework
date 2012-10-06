package com.studentsonly.grails.plugins.uiperformance;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.groovy.grails.commons.ConfigurationHolder;
import org.springframework.util.AntPathMatcher;

/**
 * Adds 'Expires' and 'Cache-Control' headers plus handles necessary headers when
 * the resource is gzipped. Only applied when in enabled for the current environment.
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
public class CacheFilter implements Filter {

	private static final List<String> DEFAULT_IMAGE_EXTENSIONS =
		Arrays.asList(new String[] { "gif", "jpg", "png", "ico" });
	private static final long SECONDS_IN_DAY = 60 * 60 * 24;
	private static final long TEN_YEARS_SECONDS = SECONDS_IN_DAY * 365 * 10;
	private static final long TEN_YEARS_MILLIS = TEN_YEARS_SECONDS * 1000;
	private static final String MAX_AGE = "public, max-age=" + TEN_YEARS_SECONDS;
	private static final Set<String> EXTENSIONS = new HashSet<String>(
			Arrays.asList(new String[] { "js", "css" }));

	private boolean _processImages;
	private boolean _processCSS;
	private boolean _processJS;
	private final AntPathMatcher _pathMatcher = new AntPathMatcher();
    private List<String> _inclusions;
	private List<String> _exclusions;

	/**
	 * {@inheritDoc}
	 * @see javax.servlet.Filter#doFilter(javax.servlet.ServletRequest, javax.servlet.ServletResponse,
	 * 	javax.servlet.FilterChain)
	 */
	public void doFilter(final ServletRequest req, final ServletResponse res, final FilterChain chain)
			throws IOException, ServletException {

		HttpServletRequest request = (HttpServletRequest)req;
		HttpServletResponse response = (HttpServletResponse)res;

		String uri = request.getRequestURI();

		if (isEnabled() && isCacheable(uri)) {
			response.setDateHeader("Expires", System.currentTimeMillis() + TEN_YEARS_MILLIS);
			response.setHeader("Cache-Control", MAX_AGE);
			if (uri.endsWith(".gz.css") || uri.endsWith(".gz.js")) {
				response.addHeader("Content-Encoding", "gzip");
				response.addHeader("Vary", "Accept-Encoding");
			}
		}

		chain.doFilter(request, response);
	}

	private boolean isEnabled() {
		return getConfigBoolean("enabled");
	}

	private boolean isCacheable(final String uri) {

        if (isIncluded(uri)) {
            return true;
        }

		if (!uri.contains("__v")) {
			return false;
		}

		if (isExcluded(uri)) {
			return false;
		}

		int index = uri.lastIndexOf('.');
		if (index == -1) {
			return false;
		}

		String extension = uri.substring(index + 1).toLowerCase();
		if (!EXTENSIONS.contains(extension)) {
			return false;
		}

		if (extension.equals("css")) {
			if (!_processCSS) {
				return false;
			}
		}
		else if (extension.equals("js")) {
			if (!_processJS) {
				return false;
			}
		}
		else if (!_processImages) {
			return false;
		}

		return true;
	}

	private boolean isIncluded(final String uri) {
		String testedUri = uri.startsWith("/") ? uri.substring(1) : uri;
		for (String pattern : _inclusions) {
			if (_pathMatcher.match(pattern, testedUri)) {
				return true;
			}
		}
		return false;
	}

	private boolean isExcluded(final String uri) {
		String testedUri = uri.startsWith("/") ? uri.substring(1) : uri;
		for (String pattern : _exclusions) {
			if (_pathMatcher.match(pattern, testedUri)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * {@inheritDoc}
	 * @see javax.servlet.Filter#init(javax.servlet.FilterConfig)
	 */
	public void init(final FilterConfig filterConfig) {
		_processImages = getConfigBoolean("processImages");
		_processCSS = getConfigBoolean("processCSS");
		_processJS = getConfigBoolean("processJS");

		initImageExtensions();
		findExclusions();
		findInclusions();
	}

	private boolean getConfigBoolean(final String name) {
		Boolean value = (Boolean)getConfigProperty(name);
		return value == null ? true : value;
	}

	@SuppressWarnings("unchecked")
	private void findExclusions() {
		_exclusions = (List<String>)getConfigProperty("exclusions");
		if (_exclusions == null) {
			_exclusions = Collections.emptyList();
		}
	}
	@SuppressWarnings("unchecked")
	private void findInclusions() {
		_inclusions = (List<String>)getConfigProperty("inclusionsForCaching");
		if (_inclusions == null) {
			_inclusions = Collections.emptyList();
		}
	}

	private Object getConfigProperty(final String name) {
		return ConfigurationHolder.getFlatConfig().get("uiperformance." + name);
	}

	@SuppressWarnings("unchecked")
	private void initImageExtensions() {
		List<String> imageExtensions = (List<String>)getConfigProperty("imageExtensions");
		if (imageExtensions == null) {
			imageExtensions = DEFAULT_IMAGE_EXTENSIONS;
		}
		EXTENSIONS.addAll(imageExtensions);
	}

	/**
	 * {@inheritDoc}
	 * @see javax.servlet.Filter#destroy()
	 */
	public void destroy() {
		// nothing to do
	}
}
