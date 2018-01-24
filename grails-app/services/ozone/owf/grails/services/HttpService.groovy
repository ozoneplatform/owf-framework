package ozone.owf.grails.services

import javax.net.ssl.KeyManagerFactory
import javax.net.ssl.SSLSocket
import java.security.KeyStore
import java.util.regex.Pattern

import grails.core.GrailsApplication

import org.springframework.core.io.ClassPathResource
import org.springframework.core.io.Resource

import org.apache.http.HttpEntity
import org.apache.http.HttpResponse
import org.apache.http.NameValuePair
import org.apache.http.client.HttpClient
import org.apache.http.client.entity.UrlEncodedFormEntity
import org.apache.http.client.methods.HttpPost
import org.apache.http.conn.scheme.Scheme
import org.apache.http.conn.ssl.SSLSocketFactory
import org.apache.http.conn.ssl.TrustSelfSignedStrategy
import org.apache.http.impl.client.DefaultHttpClient
import org.apache.http.message.BasicNameValuePair
import org.apache.http.params.HttpConnectionParams
import org.apache.http.params.HttpParams
import org.apache.http.protocol.BasicHttpContext
import org.apache.http.protocol.HTTP
import org.apache.http.util.ByteArrayBuffer


class HttpService {

  // From RFC 3986 Appendix B (http://www.ietf.org/rfc/rfc3986.txt)
  private static final Pattern URL_PARSER = ~/^(([^#:\/?]+):)?(\/\/([^#\/?]*))?([^#?]*)(\\?([^#]*))?(#(.*))?/
  private static final Long MAX_IMAGE_SIZE_BYTES = 1024000L;
  private static final Integer DEFAULT_CONNECTION_TIMEOUT = 1800000;

  GrailsApplication grailsApplication

  def post(def httpConfig, def params) {
    def returnValue = [success: false, data:""]
    httpConfig.method = 'POST'
    returnValue = fetchRemoteData(httpConfig,params)

    return returnValue
  }

  private def fetchRemoteData(def httpConfig, def params) {
      def httpClient  // presence indicates the connection and request succeeded
      def rsp         // Result returned

      if (useClientAuthentication(httpConfig)) {
          // This is something to try if the simple connection is not working
          //   Uses full client authentication as a browser would
          try {
              rsp = connect(httpConfig)
              if (rsp?.success) {
                  httpClient = rsp.data
              }
          } catch (Exception e) {
              def errMsg = "Connection error: ${e.message ?: 'see log for detail'}"
              log.error errMsg
              if (log.isDebugEnabled()) {
                  e.printStackTrace()
              }
              rsp = [success: false, data: errMsg]
          }

          if (httpClient) {
              try {
                  rsp = doPost (httpClient, httpConfig, params)
                  log.debug "Response from ${httpConfig.url}::\n${rsp}"
              }
              catch (Exception e) {
                  log.error "Error requesting data: " + e
                  if (log.isDebugEnabled()) {
                      e.printStackTrace()
                  }
                  def errMsg = "Request error: ${e.message ?: 'see log for detail'}"
                  rsp = [success: false, data: errMsg]
              }
          }
      }
      else {
          // Use a very simple java URLConnection to request data
          //  this will just use the cert present in the JVM keystore to authenticate
          try {
              def data = simpleConnect (httpConfig, params)
              rsp = [success: true, data: data]
              log.debug "Response from ${httpConfig.url}::\n${data}"
          } catch (Exception e) {
              log.error "Error requesting data: " + e
              if (log.isDebugEnabled()) {
                  e.printStackTrace()
              }
              def errMsg = "Request error: ${e.message ?: 'see log for detail'}"
              if (e.toString().indexOf("FileNotFoundException") > 0) {
                  errMsg = "Error connecting to server; check URL and ensure basic access using a web browser"
              }
              rsp = [success: false, data: errMsg]
          }
      }
      return rsp
  }

  def simpleConnect(def task, def params, boolean returnBytes = false) {
      java.security.Security.addProvider(new com.sun.net.ssl.internal.ssl.Provider());
      System.setProperty("java.protocol.handler.pkgs","com.sun.net.ssl.internal.www.protocol");

      //TODO see if this can/should be optionally specified
      System.setProperty("sun.security.ssl.allowUnsafeRenegotiation", "true");

      // Build a complete URL
      def finalUrl = assembleUrl(task, params)
      log.debug "simpleConnect(): CONNECTING to $finalUrl"
      // ...and attempt connection
      URL urlConn = new URL (finalUrl);
      HttpURLConnection urlC = (HttpURLConnection)urlConn.openConnection();
      log.debug "connection with ${urlC.class.name}"
      urlC.setDoInput(true);
      urlC.setDoOutput(true);
      urlC.setUseCaches(false);
      urlC.setRequestMethod(task.method)
      urlC.setReadTimeout(resolveTimeoutMs());

      urlC.connect()

      int status = urlC.getResponseCode();
      if (log.isDebugEnabled()) {
          log.debug "Response code: $status"
          urlC.headerFields.each {
              log.debug "Response header type: ${it.class.name}"
              log.debug "Response header: $it"
          }
      }

      if (status > 299) {
          throw new Exception("Unable to connect: response code $status")
      }

      def outs
      BufferedInputStream bis = new BufferedInputStream(urlC.getInputStream(),20000);
      ByteArrayBuffer buffer = new ByteArrayBuffer(20000);
      int current = 0;
      // read bytes one by one
      while ((current = bis.read()) != -1) {
         buffer.append((byte) current);
      }
      bis.close()

      byte[] bytes = buffer.toByteArray()
      urlC.disconnect();

      if (returnBytes) {
          return bytes
      }
          return new String(buffer.toByteArray())
  }

  private def doPost(HttpClient httpclient, def httpConfig, def params) {
      HttpPost httpPost = new HttpPost(cleanUrl(httpConfig.url))
      def rsp
      String result
      def paramMap
      if (params instanceof Map) {
          paramMap = params
      }
      else {
          // Try to parse as a String
          paramMap = convertParams(params)
      }

      List <NameValuePair> nvps = new ArrayList <NameValuePair>();
      paramMap.each() { key, value ->
         log.debug "${key} ==> ${value}"
         // Expect the caller to JSON-ize each param, as required
         // httpPost.getParams().setParameter(key, value)
         if (value instanceof List) {
             // Add value multiple times with same key
            value.each {
               nvps.add(new BasicNameValuePair(key, it.toString()))
            }
         }
         else {
            nvps.add(new BasicNameValuePair(key, value))
         }
      }

      httpPost.setEntity(new UrlEncodedFormEntity(nvps, HTTP.UTF_8))

      log.debug(dump(httpPost))
      HttpResponse response = httpclient.execute(httpPost);
      HttpEntity entity = response?.getEntity();

      if (log.isDebugEnabled()) {
          log.debug "\n\t--------------------------------------------------" +
              "\n\tResponse: ${response.getStatusLine()} (${response.class.name})"+
              "\n\t--------------------------------------------------"
      }

      if (response?.statusLine?.statusCode > 299) {
          rsp = [success: false, data: response?.statusLine.toString()]
      }
      else if (entity) {
         StringBuilder sb = new StringBuilder(20000)
         InputStream ris = entity.getContent()
         def l
         int cnt = 0
         try {
            while ((l = ris.read()) != -1) {
                ++cnt
                log.trace "[$cnt] Val: [0x${Integer.toHexString(l)}]"
                sb.append((char)l)
            }
         } finally {
             ris.close()
         }

         log.debug "\tEntity contentLength: " + sb.length()

         rsp = [success:true, data: sb?.toString()]

         /*  Cookie functionality necessary??
         log.debug "\t-------------------------------------"
         List<Cookie> cookies = cookieStore.getCookies();
         for (int i = 0; i < cookies.size(); i++) {
            println("\tCookie: " + cookies.get(i));
         }
         log.debug "\t-------------------------------------"
         */

      }
      else {
          def msg = "Error connecting...check connection details [${response?.statusLine}]"
          log.error msg
          rsp = [success: false, data: msg]
      }

      log.debug "-------------------------------------"
      log.debug "RESPONSE::\n " + result
      log.debug "-------------------------------------"

      return rsp
  }

  private def connect(def httpConfig) {
      // This method requires keystore and truststore
      if (!(httpConfig.keystorePath &&
            httpConfig.keystorePass &&
            httpConfig.truststorePath )) {
          return [success: false, data: 'Cannot connect; check keystore and truststore on interface configuration']
      }
      def rsp

      HttpClient httpclient
      KeyStore clientKeys
      KeyStore serverTrust

      log.debug "Connecting with client authorization using clientKeys/pass: [${httpConfig.keystorePath}/${httpConfig.keystorePass}]"
      def keyRsp = createKeystore(httpConfig.keystorePath, httpConfig.keystorePass)
      log.debug "Key response:: [$keyRsp]"
      if (keyRsp.success) {
          clientKeys = keyRsp.data
      }
      else {
          return keyRsp
      }

      // Truststore for server verification - this needs to contain:
      //   Server certificate: Subject CN == hostname
      //   Server private key
      // Needs to be a JKS keystore
      keyRsp = createKeystore(httpConfig.truststorePath, null)
      log.debug "Key response:: [$keyRsp]"
      if (keyRsp?.success) {
          serverTrust = keyRsp.data
      }
      else {
          return keyRsp
      }

      log.debug "\tclient key: " + clientKeys
      log.debug "\tserver key: " + serverTrust

      if (!clientKeys || !serverTrust) {
          def msg = "Error building keys: client key: [$clientKeys] server key: $serverTrust"
          log.error msg
          return [success:false, data: msg]
      }

      try {
          // ** Create Connection **
          def socketFactory = new SSLSocketFactory(
                                  SSLSocketFactory.TLS,
                                  clientKeys,
                                  httpConfig.keystorePass,
                                  serverTrust,
                                  null,
                                  new TrustSelfSignedStrategy(),
                                  SSLSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);

          // Connect socket to enable client PKI authentication
          httpclient = new DefaultHttpClient();
          HttpParams params = httpclient.getParams()

          // NOTE!! This is supposed to control the timeout of the connection/handshake
          //   period.  It does not with our current httpClient library. Could be a bug.
          //   If you enable -Djavax.net.debug=ssl, you will see setSoTimeout() getting called
          //   with the SoTimeout below around the handshake steps instead.
          //   Consequence:  if the timeout is set unsuitably low, instead of a Read Timeout
          //     error, you may receive an SSL Peer Unauthenticated error, since authentication
          //     did not complete.
          HttpConnectionParams.setConnectionTimeout(params, 30000);

          // Timeout for HTTP(S) socket reads, in ms.
          HttpConnectionParams.setSoTimeout(params, resolveTimeoutMs());

          // Expecting MD5 RC4 cipher on the cert
          SSLSocket socket = (SSLSocket) socketFactory.createSocket();
          socket.setEnabledCipherSuites("SSL_RSA_WITH_RC4_128_MD5");

          // Use task baseName to resolve host and port
          def urlTokens = parseUrl(httpConfig.url)
          def server = urlTokens['host']
          def portNum

          if (!server || server.size() <= 0) {
              def msg = "Cannot connect with null server from url: ${url}; failing"
              log.error msg
              rsp = [success:false, data:msg]
          }
          else {
              def schemeStr = urlTokens['scheme'] ?: 'https'

              if (urlTokens['port']) {
                  try {
                      portNum = Integer.parseInt(urlTokens['port'])
                  }
                  catch (Exception e) {
                      if ('http' == schemeStr) {
                          portNum = 80
                      }
                      else if ('ftp' == schemeStr) {
                          portNum = 21
                      }
                      else if ('ftps' == schemeStr) {
                          portNum = 990
                      }
                      else {
                          portNum = 443
                      }
                      log.error "Unable to parse port: ${urlTokens['port']}; defaulting to $portNum"
                  }
              }

              InetSocketAddress address = new InetSocketAddress(server, portNum);
              socketFactory.connectSocket(socket, address, null, params);

              def scheme = new Scheme(schemeStr, portNum, socketFactory);

              httpclient.getConnectionManager().getSchemeRegistry().register(scheme);

              // Create a local instance of cookie store
              //def cookieStore = new BasicCookieStore();

              // Create local HTTP context
              def localContext = new BasicHttpContext();
              // Bind custom cookie store to the local context
              //localContext.setAttribute(ClientContext.COOKIE_STORE, cookieStore);

              rsp = [success:true, data: httpclient]
          }

      } catch (Exception e) {
          def msg = "Error creating SSL socket: ${e.message}"
          log.error msg
          if (log.isDebugEnabled()) {
              e.printStackTrace()
          }
          rsp = [success:false, data: msg]
      }

      return rsp
  }


  /**
  *  Return a Keystore from a given filename and password
  */
  private def createKeystore (String filename, String password) {
      log.debug "Default KeyAlgo: " + KeyManagerFactory.getDefaultAlgorithm()
      log.debug "Default KeyStore: " + KeyStore.getDefaultType()  // jks
      def rsp

      // Pull off file extension
      def keyType = filename[-3..-1]
      log.debug "Requested KeyType: " + keyType

      // Client keystore, for client authentication
      KeyStore keys
      switch (keyType) {
         case "p12":
            keys = KeyStore.getInstance("pkcs12");
            break
         default:
            keys = KeyStore.getInstance(KeyStore.getDefaultType());
            log.info "Could not find key type $keyType; using default type ${keys.getType()}"
      }
      def instream
      def fileRsp = resolveFile(filename)

      if (fileRsp.success) {
          File keyFile = fileRsp.data
          try {
              instream = new FileInputStream(keyFile);
              log.debug "Loading keys: ${fileRsp.data?.absolutePath}"
              keys.load(instream, (password?password.toCharArray():null));

              if (keys && log.isDebugEnabled()) {
                  log.debug "------------------------------------------"
                  log.debug "  Cert: "
                  for (Enumeration e = keys.aliases() ; e.hasMoreElements() ;) {
                      String a = e.nextElement();
                      log.debug "\talias: $a"
                      //log.debug "\t alias $a:: " +(keys?.isKeyEntry()? 'is a key ' : (keys?.isCertificateEntry() ? 'is a cert':'is unknown type'))
                  }
                  log.debug "------------------------------------------"
              }
              if (keys) {
                  rsp = [success:true, data: keys]
              }
              else {
                  rsp = [success:false, data: "Error loading keys"]
              }
          }
          catch (Exception e) {
             def msg = "Error opening keystore: $e"
             if (e.getClass().getName().indexOf("BadPadding") > 0) {
                 msg += " (This is likely a password issue}"
             }
             log.error msg
             if(log.isDebugEnabled()) {
                 e.printStackTrace()
             }
              rsp = [success:false, data: msg]
          } finally {
             try { if(instream) instream.close() } catch (Exception ignore) {}
          }
      }
      else {
          log.debug "Keystore file problem; using file response [$rsp]"
          rsp = fileRsp
      }

      return rsp
   }

  private def resolveFile (String pathIn) {
      if (!pathIn || pathIn.size() <= 0) {
          return null
      }
      def outFile
      def rsp
      if (pathIn.startsWith("file:/")) {
          try {
              outFile = new File(new URI(pathIn))
              log.debug "Loaded File from URI: ${outFile?.absolutePath}"
          } catch (Exception e) {
              log.debug e
              rsp = [success: false, data: "Error reading file [$pathIn]: ${e.message}"]
          }
      }
      else {
          try {
              Resource resource = new ClassPathResource(pathIn)
              outFile = resource?.file
              log.debug "Loaded File from classpath: ${outFile?.absolutePath}"
          } catch (Exception e) {
              log.debug e
              rsp = [success: false, data: "Error reading file [$pathIn]: ${e.message}"]
          }
      }
      if (!outFile) {
          // Try a simple local file
          try {
              outFile = new File(pathIn)
              log.debug "Loaded File from local FS: ${outFile?.absolutePath}"
          } catch (Exception e) {
              log.debug e
              rsp = [success: false, data: "Error reading file [$pathIn] locally or from classpath: ${e.message}"]
          }
      }
      if (outFile && outFile?.exists()) {
          log.debug "Returning file: ${outFile}"
          rsp = [success:true, data: outFile]
      }
      else if (!rsp) {
          rsp = [success: false, data: "File was not found: [$pathIn]"]
      }
      return rsp
  }

  private static Map parseUrl (String url) {
      def retVal = [:]
      if (url && url.size() > 0) {
          def m =(url =~ URL_PARSER)
          if (m?.groupCount() > 0) {
              if (m[0][2]) retVal['scheme'] = m[0][2]
              if (m[0][5]) retVal['path'] = m[0][5]
              if (m[0][6]) retVal['args'] = m[0][6]
              if (m[0][9]) retVal['related'] = m[0][9]

              if (m[0][4] != null && m[0][4].size() > 0) {
                  def l = m[0][4].split(':')
                  if (l?.size() > 0) {
                      retVal['host'] = l[0]
                  }
                  if (l?.size() > 1) {
                      retVal['port'] = l[1]
                  }
              }
          }
      }
      return retVal
  }

  /**
   * Resolve the HTTP socket timeout to use, in milliseconds
   * @return
   */
  private def resolveTimeoutMs() {
      //   For now, just use the standard timeout from configuration
      def t = DEFAULT_CONNECTION_TIMEOUT
      if (grailsApplication.config.owf.metric.timeout) {
          // Override exists - could be a String or numeric
          try {
              t = Integer.valueOf(grailsApplication.config.owf.metric.timeout)
          }
          catch (Exception e) {
              log.error "Configured value for [metricTimeout] is not a valid number [${grailsApplication.config.metricTimeout}]; please check the value in MarketplaceConfig.groovy"
          }
      }

      log.debug ("Using connection timeout: $t(ms)")
      return t
  }

  /**
   * Ensures URL uses http protocol; currently does not use regex validation though.
   * Removes any trailing slash.
   * @param urlIn
   * @return
   */
  def cleanUrl (String urlIn) {
      if(!urlIn || urlIn.length() <= 0) return null

      String url = urlIn.trim()

      if (!url.startsWith("http")) {
          def errMsg = "Import URL using incorrect protocol (not http/s): $url"
          log.error errMsg
          return "Error: $errMsg"
      }
      if (url.endsWith("/")) {
          // remove last char
          url = url[0..-2]
      }
      /* -- Do not assume endpoint is static
      if (!url.endsWith("ews/service")) {
          url = url + "/ews/service"
      }
      */
      return url
  }

  /**
   * If a String of params is given, we may need to convert these
   * to a Map
   * @param s
   * @return
   */
  Map convertParams(String s) {
      if (!s || s.trim()?.size() <= 0) {
          return [:]
      }
      def params = s.tokenize('&')
      def m = [:]
      params.each { it->
         def vals = it.tokenize('=')
         m[vals[0]] = vals[1]
      }
      return m
  }

  def String dump(post) {
      StringBuilder sb = new StringBuilder(128)

      sb.append("\n\t------------------------------")
      sb.append("\n\tRequestURL: ").append(post.getURI())
      sb.append("\n\tType: ").append(post.getMethod())
      sb.append("\n\tParams: ").append(post.getParams())
      org.apache.http.params.BasicHttpParams
      sb.append("\n\t------------------------------")

      return sb.toString()
  }

  /**
   * Given a  URL and a Map of parameters, assemble into a URL with encoded parameters.
   * @param url
   * @param paramMap
   * @return String URL
   */
  private String assembleUrl(def task, def params) {
      log.debug "Assemble URL from: ${task.url} and [$params]"
      // Append a ? to the URL in preparation for args, if we have any
      def url = cleanUrl(task.url)

      def out = []
      out << url
      if ((params?.size() > 0 || task.extraUrlParams?.size() > 0)) {
           out << "?"
      }
      if (params?.size() > 0) {
          if (params instanceof Map) {
              // Encode the parameters that we have before appending
              def encVal
              params.each() { key, value ->
                  encVal = URLEncoder.encode(value, 'UTF-8')
                  out << "$key=$encVal&"
              }
          }
          else {
              //TODO Consider parsing and re/encoding the params
              out << "$params&"
          }
      }
      // Tack on extraUrlParams if they exist
      //TODO Consider parsing and re/encoding
      if (task?.extraUrlParams?.size() > 0) {
          out << task?.extraUrlParams
      }

      def result = out.join()
      if (result.endsWith("&")) {
          result = result[0..-2]
      }

      log.debug "Returning URL: ${result}"
      return result
  }

  private boolean useClientAuthentication(def httpConfig) {
      return (httpConfig.keystorePath?.size() > 0 &&
              httpConfig.keystorePass?.size() > 0 &&
              httpConfig.truststorePath?.size() > 0)
  }

}
