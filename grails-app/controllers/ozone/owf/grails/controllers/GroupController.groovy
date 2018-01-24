package ozone.owf.grails.controllers

import grails.converters.JSON

import org.apache.commons.lang.time.StopWatch

import ozone.owf.grails.OwfException
import ozone.owf.grails.services.GroupService


class GroupController extends BaseOwfRestController {

  GroupService groupService

  def show = {
    def statusCode
    def jsonResult
    StopWatch stopWatch = null;

    if (log.isInfoEnabled()) {
      stopWatch = new StopWatch();
      stopWatch.start();
      log.info("Executing groupService: show - params:$params");
    }
    try {
        def result = groupService.show(params)
        statusCode = 200
        jsonResult = result as JSON
    }
    catch (OwfException owe) {
        handleError(owe)
        statusCode = owe.exceptionType.normalReturnCode
        jsonResult = "Error during show: " + owe.exceptionType.generalMessage + " " + owe.message
    }

    renderResult(jsonResult, statusCode)

    if (log.isInfoEnabled()) {
        log.info("Executed groupService: list in "+stopWatch);
    }
  }

  def list = {
      def statusCode
      def jsonResult
      StopWatch stopWatch = null;

      if (log.isInfoEnabled()) {
        stopWatch = new StopWatch();
        stopWatch.start();
        log.info("Executing groupService: list - params:$params");
      }
      try {
          def result = groupService.list(params)
          statusCode = 200
          jsonResult = result as JSON
      }
      catch (OwfException owe) {
          handleError(owe)
          statusCode = owe.exceptionType.normalReturnCode
          jsonResult = "Error during list: " + owe.exceptionType.generalMessage + " " + owe.message
      }

      renderResult(jsonResult, statusCode)

      if (log.isInfoEnabled()) {
          log.info("Executed groupService: list in "+stopWatch);
      }
  }

  def createOrUpdate = {
    def jsonResult
    StopWatch stopWatch = null;

    if (log.isInfoEnabled()) {
      stopWatch = new StopWatch();
      stopWatch.start();
      log.info("Executing groupService: createOrUpdate");
    }
    try {
        def result = groupService.createOrUpdate(params)
        jsonResult = [msg: result as JSON, status: 200 ]
    }
    catch (Exception e) {
        jsonResult = handleError(e)
    }

    renderResult(jsonResult)

    if (log.isInfoEnabled()) {
        log.info("Executed groupService: createOrUpdate in "+stopWatch);
    }
  }

  def delete = {
    def jsonResult
    StopWatch stopWatch = null;

    if (log.isInfoEnabled()) {
      stopWatch = new StopWatch();
      stopWatch.start();
      log.info("Executing groupService: delete");
    }
    try {
        def result = groupService.delete(params)
        jsonResult = [msg: result as JSON, status: 200]
    }
    catch (Exception e) {
        jsonResult = handleError(e)
    }

    renderResult(jsonResult)

    if (log.isInfoEnabled()) {
        log.info("Executed groupService: delete in "+stopWatch);
    }
  }

  def copyDashboard = {
    def jsonResult
    StopWatch stopWatch = null;

    if (log.isInfoEnabled()) {
      stopWatch = new StopWatch();
      stopWatch.start();
      log.info("Executing groupService: copyDashboard");
    }
    try {
        def result = groupService.copyDashboard(params)
        jsonResult = [msg: result as JSON, status: 200]
    }
    catch (Exception e) {
        jsonResult = handleError(e)
    }

    renderResult(jsonResult)

    if (log.isInfoEnabled()) {
        log.info("Executed groupService: copyDashboard in "+stopWatch);
    }
  }
}
