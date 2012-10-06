 package ozone.owf.grails.controllers

 class ErrorController {

     def index = {
         try
         {

             def emsg = request?.exception?.message
             String msg = 'An error has occurred on the server'
             if (emsg)
                 msg += ": ${emsg?.encodeAsHTML()}"
             else
                 msg += '.'
             msg = "\"${msg.replaceAll(/"/, /\\"/)}\""  // need to escape stuff so parser doesn't choke
             if (isWindowname()) {
                 session['windowname'] = 'true'
                 render(view: '/show-windowname', model: [value: "${msg}", status: 500])
             } else
         {
             render(msg)
             }
         } catch(Exception e) {
             e.printStackTrace()
         }
     }

     protected isWindowname() {
         return params['windowname'] == 'true'
     }
 }
