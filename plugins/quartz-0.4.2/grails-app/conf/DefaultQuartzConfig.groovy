
quartz {
    autoStartup = true
    jdbcStore = false
    waitForJobsToCompleteOnShutdown = true
}

environments {
    test {
        quartz {
            autoStartup = false
        }
    }
}
