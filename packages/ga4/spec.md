# Event types

## Automatically collected events

collected by default when you set up Google Analytics on your website or app.

## Enhanced measurement

are collected when enhanced measurement is enabled.

## Recommended events

that you implement, but that have predefined names and parameters. These events unlock existing and future reporting capabilities.

## Custom events

that you define. Make sure you only create custom events when no other events work for your use case.
Custom events don't show up in most standard reports so you need to set up custom reports or explorations for meaningful analysis.

# Data

## Default

Collected by default with every event

```
language
page_location (420 characters or fewer)
page_referrer (420 characters or fewer)
page_title (300 characters or fewer)
screen_resolution
```

The value assigned to event parameters must be **100** characters or fewer

# Automatically collected events

## Click
click
each time a user clicks a link that leads away from the current domain

By default, outbound click events will occur for all links leading away from the current domain. Links to domains configured for cross-domain measurement will not trigger outbound click events.

The parameters populate the following dimensions:

Link classes (from link_classes)
Link domain (from link_domain)
Link ID (from link_id)
Link URL (from link_url)
Outbound (from outbound)

Collected by default via enhanced measurement.


## File download
file_download
When a user clicks a link leading to a file (with a common file extension) of the following types:
document
text
executable
presentation
compressed file
video
audio
This event is collected by default via enhanced measurement. 

File extensions that trigger the event:
pdf|xlsx?|docx?|txt|rtf|csv|exe|key|pp(s|t|tx)|7z|pkg|rar|gz|zip|avi|mov|mp4|mpe?g|wmv|midi?|mp3|wav|wma 

Parameters:file_extension, file_name link_classes, link_domain, link_id, link_text, link_url


## First visit
first_visit
the first time a user visits a website or launches an Android instant app with Analytics enabled


## Form start
form_start
The first time a user interacts with a form in a session

Note: You can only use the parameters in your reports if you create custom dimensions for them.

Collected by default via enhanced measurement. 

Parameters:
form_id, form_name, form_destination




## Form submit
form_submit
when the user submits a form

Note: You can only use the parameters in your reports if you create custom dimensions for them.

Collected by default via enhanced measurement.

Parameters
form_id, form_name, form_destination, form_submit_text




## Page view
page_view

Each time the page loads or the browser history state is changed by the active site

Collected by default via enhanced measurement.

page_location (page URL), page_referrer (previous page URL), engagement_time_msec



## Scroll
scroll

The first time a user reaches the bottom of each page (i.e., when a 90% vertical depth becomes visible)

Collected by default via enhanced measurement.

Parameters
engagement_time_msec



## Session start
session_start

when a user engages the app or website

A session ID and session number are generated automatically with each session and associated with each event in the session. 
(Session definitions - https://support.google.com/analytics/answer/9191807?visit_id=638136980983551662-1667202342&rd=1)


## User engangement
user_engagement
when the app is in the foreground or webpage is in focus for at least one second.

Parameters
engagement_time_msec

User engagement definitions - https://support.google.com/analytics/answer/11109416#user-engagement



## Video complete
video_complete
when the video progresses past 10%, 25%, 50%, and 75% duration time

For embedded YouTube videos that have JS API support enabled.

Collected by default via enhanced measurement.

Parameters
video_current_time, video_duration, video_percent, video_provider, video_title, video_url, visible (boolean)




## Video start
video_start

when the video starts playing

For embedded YouTube videos that have JS API support enabled.

Collected by default via enhanced measurement.

Parameters
video_current_time, video_duration, video_percent, video_provider, video_title, video_url, visible (boolean)




## View search results
view_search_results

each time a user performs a site search, indicated by the presence of a URL query parameter

Collected by default via enhanced measurement.

Parameters
search_term, optionally ‘q_<additional key="">’ (where <additional key=""> matches an additional query parameter you specify to be collected under advanced settings)







# Recommended events
https://support.google.com/analytics/answer/9267735?hl=en&ref_topic=13367566