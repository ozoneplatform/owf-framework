# Ozone Widget Framework 
 
## Description

The Ozone Widget Framework (OWF) is a web application for composing other lightweight web applications called "widgets".  It's basically a glorified web portal engine, with the unusual characteristic that the content within the portal (i.e. the widgets) is decentralized.  It includes a secure, in-browser, pub-sub eventing system, allowing widgets from different domains to share information.  The combination of decentralized content and in-browser messaging makes OWF particularly suited for large distributed enterprises with legacy stovepipes that need to combine capability "at the glass".
 
## Screenshots

![Launch Menu](http://i.imgur.com/RuUyn.png)

![Graphing](http://i.imgur.com/8uZs1.png)

![Dashboards](http://i.imgur.com/7FFlu.png)

## Technology components
For Version 7 of OWF, the front-end user interface uses Ext JS, and the back-end uses Grails.  User preferences are stored in a relational database - anything supported by Hibernate.  Authentication of users is a modular function provided by Spring Security.  There is a re-factoring effort planned for 2013 to improve performance, modularity, and maintainability, which is expected to eliminate the dependency on Grails and Ext JS.
 
 
## Browser Support
Numbered releases are tested on IE7, IE8, IE9, Firefox 3.6 and the latest public version of Firefox.  Some of the developers use Safari or Chrome, so generally it works well with those browsers also.
 
## Copyrights
> Software (c) 2012 [Next Century Corporation](http://www.nextcentury.com/ "Next Century")

> Portions (c) 2009 [TexelTek Inc.](http://www.texeltek.com/"TexelTek")

> The United States Government has unlimited rights in this software, pursuant to the contracts under which it was developed.  
 
The Ozone Widget Framework is released to the public as Open Source Software, because it's the Right Thing To Do. Also, it was required by [Section 924 of the 2012 National Defense Authorization Act.](http://www.gpo.gov/fdsys/pkg/PLAW-112publ81/pdf/PLAW-112publ81.pdf "NDAA FY12")

Released under the [Apache License, Version 2.](http://www.apache.org/licenses/LICENSE-2.0.html "Apache Licence v2")
 
## Community

### Google Groups

[ozoneplatform-users](https://groups.google.com/forum/?fromgroups#!forum/ozoneplatform-users) : This list is for users, for questions about the platform, for feature requests, for discussions about the platform and its roadmap, etc.

[ozoneplatform-dev](https://groups.google.com/forum/?fromgroups#!forum/ozoneplatform-dev) : This list is for the development community interested in extending or contributing to the platform.

[ozoneplatform-announcements](https://groups.google.com/forum/?fromgroups#!forum/ozoneplatform-announce) : This list is for announcements as new versions are released, technology refreshes are performed, or other relevant information as needed to be released.
 
### OWF GOSS Board
OWF started as a project at a single US Government agency, but developed into a collaborative project spanning multiple federal agencies.  Overall project direction is managed by "The OWF Government Open Source Software Board"; i.e. what features should the core team work on next, what patches should get accepted, etc.  Gov't agencies wishing to be represented on the board should check http://owfgoss.org for more details.  Membership on the board is currently limited to Government agencies that are using OWF and have demonstrated willingness to invest their own energy and resources into developing it as a shared resource of the community.  At this time, the board is not considering membership for entities that are not US Government Agencies, but we would be willing to discuss proposals.
 
### Contributions

#### Non-Government
Contributions to the baseline project from outside the US Federal Government should be submitted as a pull request to the core project on GitHub.  Before patches will be accepted by the core project, contributors have a signed [Contributor License Agreement](https://www.ozoneplatform.org/ContributorLicenseAgreement1-3OZONE.docx) on file with the core team.  If you or your company wish your copyright in your contribution to be annotated in the project documentation (such as this README), then your pull request should include that annotation.
 
#### Government
Contributions from government agencies do not need to have a CLA on file, but do require verification that the government has unlimited rights to the contribution.  An email to goss-support@owfgoss.org is sufficient, stating that the contribution was developed by an employee of the United States Government in the course of his or her duties. Alternatively, if the contribution was developed by a contractor, the email should provide the name of the Contractor, Contract number, and an assertion that the contract included the standard "Unlimited rights" clause specified by [DFARS 252.227.7014](http://www.acq.osd.mil/dpap/dars/dfars/html/current/252227.htm#252.227-7014) "Rights in noncommercial computer software and noncommercial computer software documentation".
 
Government agencies are encouraged to submit contributions as pull requests on GitHub.  If your agency cannot use GitHub, contributions can be emailed as patches to goss-support@owfgoss.org.
 
### Roadmap
 
There is work underway to re-factor OWF to use OSGi on the back end, and eliminate the dependency on Ext JS for the front-end.  Multiple alphas have been released, and announced on [ozoneplatform-announce](https://groups.google.com/forum/?fromgroups#!forum/ozoneplatform-announce).  Although we initially intended a release for June 2013, we're revisiting our design to make sure it is fully scalable and enterprise-ready, both for OWF itself and for other capabilities built on top of the services of what we're calling _ozoneplatform_.  Watch [ozoneplatform-announce](https://groups.google.com/forum/?fromgroups#!forum/ozoneplatform-announce), as well as this page, for further information as to specific timelines and availability of alphas.
 
### Related projects
 
#### OWF Mobile
The US Army has done some work on a redesigned interface to OWF - particularly suited to tablet devices.  This is not part of the core project.  Yet.
 
#### OWF-Touchscreen
The Army has also done work on a redesigned interface for touchscreen devices.  This is not part of the core project.  Yet.
 
#### Ozone Marketplace
A "sister project" of OWF.  Marketplace is a search engine for "widgets", effectively the "apps store" for OWF.  This project was under heavy re-factoring in the fall of 2012 and is not in a state where it is ready to be released as open source, but should be expected to be released sometime in 2013.  US Government agencies can get Marketplace from OWFGOSS.org.
 
#### Ozone Synapse
A "sister project" of OWF.  Synapse provides a data-query/caching layer that is an optional add-on to OWF.  US Government agencies can get Synapse from OWFGOSS.org.
