define(

  'views/ScavItemsView',

  [ 'App',
    'views/BaseView',
    'text!partials/scav-items.html',
    'utils/Debug'],

  function(App, BaseView, template, Debug)
  {
    return BaseView.extend({

      viewData: null,
      cachedTemplate: _.template(template),
      selectedScavItemId: null,
      defaultItemFoundImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABlCAYAAADnNAXVAAAACXBIWXMAAAsTAAALEwEAmpwYAABB12lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDE0LTAxLTE3VDE0OjEzOjU4LTA4OjAwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMTQtMDEtMThUMTU6MTc6NDctMDg6MDA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDE0LTAxLTE4VDE1OjE3OjQ3LTA4OjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOjllMTc3OWIxLTI3MWYtNDZlZC05ZDMwLWQwM2ZiMjlhOWMyMDwveG1wTU06SW5zdGFuY2VJRD4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+eG1wLmRpZDoxYTc0OGNhNS1lYTk1LTRkOTItYWI3Yi03M2Q5ZTlhZDUwNzU8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDoxYTc0OGNhNS1lYTk1LTRkOTItYWI3Yi03M2Q5ZTlhZDUwNzU8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jcmVhdGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MWE3NDhjYTUtZWE5NS00ZDkyLWFiN2ItNzNkOWU5YWQ1MDc1PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE0LTAxLTE3VDE0OjEzOjU4LTA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jb252ZXJ0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnBhcmFtZXRlcnM+ZnJvbSBpbWFnZS9wbmcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcDwvc3RFdnQ6cGFyYW1ldGVycz4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6Y2RmNzRiMzEtZGYyZi00MGY1LTk2YjQtZDY1MDMzMThhNjUyPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE0LTAxLTE4VDE1OjEzOjU3LTA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjNjOThmNDQ0LTE1YjMtNDQwZS05M2E4LWZjZjUxZGMyMmJkYjwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNC0wMS0xOFQxNToxNzo0Ny0wODowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y29udmVydGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpwYXJhbWV0ZXJzPmZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmc8L3N0RXZ0OnBhcmFtZXRlcnM+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5kZXJpdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpwYXJhbWV0ZXJzPmNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nPC9zdEV2dDpwYXJhbWV0ZXJzPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDo5ZTE3NzliMS0yNzFmLTQ2ZWQtOWQzMC1kMDNmYjI5YTljMjA8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTQtMDEtMThUMTU6MTc6NDctMDg6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8eG1wTU06RGVyaXZlZEZyb20gcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICA8c3RSZWY6aW5zdGFuY2VJRD54bXAuaWlkOjNjOThmNDQ0LTE1YjMtNDQwZS05M2E4LWZjZjUxZGMyMmJkYjwvc3RSZWY6aW5zdGFuY2VJRD4KICAgICAgICAgICAgPHN0UmVmOmRvY3VtZW50SUQ+eG1wLmRpZDoxYTc0OGNhNS1lYTk1LTRkOTItYWI3Yi03M2Q5ZTlhZDUwNzU8L3N0UmVmOmRvY3VtZW50SUQ+CiAgICAgICAgICAgIDxzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDoxYTc0OGNhNS1lYTk1LTRkOTItYWI3Yi03M2Q5ZTlhZDUwNzU8L3N0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPC94bXBNTTpEZXJpdmVkRnJvbT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+NjU1MzU8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjc2PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjEwMTwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+SMvRSgAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAEgElEQVR42uyc3XHiMBDH//HkPXQQOggdnFNByKv1cKaCUAIlOBXE9yC/xlSAU8GZDqADqCD34DVnFBt/ALKEd2eYDDMxkn9e7ZfWuvv+/gZLc3EYAQNjYAyMgTEwFgbGwBgYA2NgLPd9DOoJMQHgAhgDmNDfx5rLtgA2AFL6m0RSprrnfqcj+faEGAGY0scF8HChn94DSADEAOJIyp3VwDwhpgB8AC+aFGAJIIykjK0C5gnhA1g0WGbXki2ARSRlaDQwA0BdHdxFgHlCuAACAE+GOrc1gHkkZdJ7WOEJEQBYGQwLNLcVzbUfDaPQIDQcVJW2+V1DEqcjrCm5c9tg5dqW0D1cHxgZ9s8LxlJ9yAOAT7qX6wGjAT5uKNP5aAvNGTCsTtCcgcNqDa3WS5Jx/BxIMeK1Lq06CYxCh8RyA982mXdPhRx1SzIcEKzce4adbBhFxU8YnjydyghKlyTlhisMW57Lcs8qDQvAEjTSsB5DiCWy8nNZRWGCrFL7onlOM7U0VFbTX2j2SgGAoKa8nAAIqNQ9p48OZ7RQncCRhmnWrjWAaSTlxvBKyZGWqcA20FMt/RNJ6SsQxvi/UTIiGF8Adsg2OELl/0eaKibbSMrxD2AaI/p1JOWkJIR5q7nuC1nVNFWgbTQsz0MGUPSSvqalOC3esCdE2gAWAPwC8JdCHgAA2b25hjn7R2EFPSkdHuhdsVmLDksqpvnm0EJkmx3XlJd8TEd96rpiGzLcbx1+oyx9iXWtDJ3A1op2zS/xxAthh1ZgroYBkypb1lGKjmOnYf4uADi0NHQEgakSQthWBXnwhJg4mrQL5P5zGVuaX7qOxZNPK5bnNWV8r3GwlSfExRJ1JffUdQ8TWzUsUKL937o0zIE5nTZtgt+kp+rKo209rutIynlBu9yOwW9nsQnYuujRKTSJdU/i3hJYR+UgsltxH7GcYymsBD3taJkObGkSLNOBbVGoQ5kAy3Rg0zw4NQVWDmxrIKx3pb8hhBm78FtHSYpNjOSn0L8fWVlAcJQk1gjbpRQaXZMSfhM1LFG+mwRs40BPebfVpJTvJnUQJQ4Z1z1Y6mQfSZk6FcuApcJU5LlkbJAn8oubtQZJrAIzpUv6EWbW6OJDpE8R9ZJX3cmcdqemRiFzqZQDm77anU7JH+Xh9d1re9TupBYQFwbYsk2xZn/BnaausqisVmjqhLFJtmojn1NHdODyg0VVn36KYb7UUJQfnZJVGgbo6eozXUoZlAIjo/s+YFjvVScQ1L3NNsSlWboU65bkIa8bWCVjj5rm6JPAqPTjDwhY7fEMtbtG1J8+GwCsWZNDjhpts1HwNrtxWI1y6cb7kjcMbdbmMKNWG7k3CG3W9uSn1jvfNMCr5d5zj+z9obDthZ1aBcg4ush6tqyLs5CdHBB3ufjs88MavolmUgR/Vtp3djMKTeDZcG1bI3vp/ewcmY/06xOYQeDsODSyBNwUfCxpJ3Aj8MG3ZwGcgI9WvijQMYCdDo25CWAmCx8Pz8AYGANjYAyMhYExMAbGwBgYC/4NAELe9b0+9ojhAAAAAElFTkSuQmCC",
      cameraViewImgURL: null,

      events: {
        'click .scav-item-camera-action a': 'goToCameraClick',
        'click .scav-item-camera-goback-action a' : 'goBackToScavItemsClick',
        'click .scav-item-camera-gobackafterattempt-action a' : 'goBackToScavItemsClick',
        'change input[type=file]': 'loadPicture',
        'click .quit-scav-action a': 'quitScavClick'
      },

      onInitialize: function(opts)
      {
      },

      activate: function(viewData)
      {
        Debug.log('ScavItemsView -> activate()', viewData);
        this.viewData = viewData;

        this.render();
        this.startTimer();
      },

      deactivate: function()
      {
        this.undelegateEvents();
      },

      render: function()
      {
        this.$el.html(this.cachedTemplate({
          title: this.viewData.scavName.toUpperCase() + ' Scav',
          buttonLabel: 'Quit Scav&nbsp&nbsp',
          scavItems: this.viewData.scavItems,
          recentItem: this.viewData.recentItem,
          pointTotal: this.viewData.pointTotal,
          duration: this.viewData.duration,
          scavItemsFound: this.viewData.scavItemsFound,
          scavItemsLeft: this.viewData.scavItemsLeft,
          thumbnailImageURL: this.viewData.thumbnailImageURL,
          href: this.viewData.buildHref
        }));

        this.delegateEvents();
      },

      quitScavClick: function(e)
      {
        e.preventDefault();

        this.trigger('quit-scav:click');
      },

      goToCameraClick: function(e)
      {
        e.preventDefault();

        if($('.scav-listitems').hasClass('game-over-disabled'))
          return;

        // Look up the item
        this.selectedScavItemId = $(e.currentTarget).data('scavitem-id');

        // kick out if the user already found it by checking disabled state
        var scavItemRowDisabledElement = $('.scav-item-disabled[data-scavitem-id*=' + this.selectedScavItemId + ']');

        if(scavItemRowDisabledElement.is(':visible'))
          return;

        var scavItem = _.findWhere(this.viewData.scavItems, { id: this.selectedScavItemId });

        // Because of how the CSSHelper structures the imageURLSm property ('background: url([path to image])'),
        // we need to get he actual value that is set on the background attribute. To do this,
        // we're doing a split on the whitespace, and grabbing the second object in the array that is
        // returned, which is the url() value.
        var scavItemImageURLBackgroundAttributeValue = scavItem.imageURLSm.split(" ")[1];
        var pointText = scavItem.points == 1 ? ' point' : ' points';

        // Populate the view
        $('.scav-camera-item-info-name').text(scavItem.name);
        $('.scav-camera-item-info-points').text(scavItem.points + pointText);
        $('.scav-camera-item-info-hint').text(scavItem.fullHint);

        // Slide the camera view in
        $('.scav-tableview').transition({ x: -92 }, 300, 'ease');

        $('.scav-cameraview')
          .transition({ right: 0 }, 400, 'snap', function() {
            // We have to wait until the animation is done to circumvent the
            // chunkiness that comes with loading an image on the fly
            $('.scav-itemtofind-image').fadeOut('fast', function()
            {
              $(this).css('background', scavItemImageURLBackgroundAttributeValue).fadeIn('fast');
            });
          });
      },

      goBackToScavItemsClick: function(e)
      {
        e.preventDefault();

        if($('.scav-listitems').hasClass('game-over-disabled'))
          return;

        // Slide the camera view back
        var windowWidth = window.innerWidth;
        var imageElement = $('.scav-itemtofind-image');

        $('.scav-tableview').transition({ x: 0 }, 300, 'ease');

        // Need this for scoping when calling the helper methods in the
        // callback below
        var view = this;

        $('.scav-cameraview')
          .transition({ right: -windowWidth }, 400, 'ease', function() {
            this.css('right', '-100%');

            // Swap the placeholder back in
            imageElement.css('background', 'url(resources/img/scavitemsscreen/itemstofind/itemstofind-preloader.png) center center no-repeat');

            // Clear out the last picture taken
            $('.scav-itemfound-image img').attr('src', this.defaultItemFoundImage);

            // Restore elements to their original state
            view.restoreGoBackCta();
            view.restoreCameraCta();
            view.restoreScavItemCameraResultView();

            // Clean the image object out of memory
            if(this.cameraViewImgURL == null)
              window.webkitURL.revokeObjectURL(this.cameraViewImgURL);
          }
        );
      },

      loadPicture: function(e)
      {
        App.getInstance().getDep('viewmodels/AppViewModel').showLoadIndicator();

        if($('div.scav-item-camera-cta').hasClass('retake-picture'))
          this.restoreOperatorIconAndResultMessage();

        var pictureFiles = e.target.files;

        if(pictureFiles && pictureFiles.length > 0)
        {
          var pictureFile = pictureFiles[0];

          var reader = new FileReader();
          var view = this;

          reader.onload = function (readerEvent) {
            this.cameraViewImgURL = window.webkitURL.createObjectURL(pictureFile);

            if(this.cameraViewImgURL != null) {

              // These are getting used in an animation callback,
              // so we need to push these dependencies into locals
              // for scope
              var imgURL = this.cameraViewImgURL;
              var $scavItemResultView = $('.scav-camera-result-view');
              var $itemToFindResultImage = $('.scav-itemtofind-result-image');
              var $scavItemFoundImageElement = $('.scav-itemfound-image img');

              var scavItem = _.findWhere(view.viewData.scavItems, { id: view.selectedScavItemId });
              var scavItemLargeImageURLBackgroundAttributeValue = scavItem.imageURLLg.split(" ")[1];

              // Hide initial view
              $('.scav-camera-initial-view').fadeOut('fast', function() {
                  // Set the large version of the image for the item selected
                  $itemToFindResultImage.css('background', scavItemLargeImageURLBackgroundAttributeValue);
                  $scavItemFoundImageElement.attr('src', imgURL);

                  // Display the result view with just the large version of the image for the
                  // item we're looking for and the ? placeholder for the picture taken
                  $scavItemResultView.fadeIn('slow');
                });
            }

            // Start work on saving picture to camera roll.
            // First get the binary version out of the result
            // property
            var pictureBinaryString = readerEvent.target.result;

            // Now convert it to a base64 string
            var pictureAsBase64String = btoa(pictureBinaryString);

            // And build a request body with it.
            // The native container will intercept the POST
            // and do the work of converting the base64 string
            // version of the photo back to a real image and
            // save it to the camera roll
            var data = {
              selectedScavItemId: view.selectedScavItemId,
              imgURL: pictureAsBase64String
            };

            // Kick the item check and image save task
            view.trigger('verify-found-scav-item:action', data);
          };

          // The rubber meets the road for the post - picture taking event
          // happens here.  Everything above in reader.onload is the callback
          // that happens on this method call
          reader.readAsBinaryString(pictureFile);
        }
      },

      updateCameraViewWithResult: function (data)
      {
        Debug.log('ScavItemsView > updateCameraViewWithResult');

        if(data.scavItemStatus == 'FOUND')
        {
          // update the state of the row item
          var scavItemRowDisabledElement = $('.scav-item-disabled[data-scavitem-id*=' + this.selectedScavItemId + ']');
          scavItemRowDisabledElement.show();

          App.getInstance().getDep('viewmodels/AppViewModel').hideLoadIndicator();

          this.showCameraViewSuccess(data);
        }
        else
        {
          App.getInstance().getDep('viewmodels/AppViewModel').hideLoadIndicator();

          this.showCameraViewNotFound(data);
        }
      },

      showCameraViewSuccess: function(data)
      {
        // Setting up some local vars for reuse and to deal
        // with scope
        var view = this;
        var $operatorIcon = $('.scav-item-operator-icon');
        var $headsUpPointTotal = $('.scav-headsup-point-total p');
        var $headsUpItemName = $('.scav-headsup-itemname-label');
        var $foundTotal = $('.scav-found-label-value');
        var $leftTotal = $('.scav-left-label-value');

        // Show the equals operator
        $operatorIcon.toggleClass('equals');
        $operatorIcon.transition({ scale: 0 })
                     .transition({ scale: 1.8, opacity: 1 })
                     .transition({ scale: 1.0 }, 200, 'snap', function() {
                        // Update the Sweet!/Bummer! message
                        var $resultLabel = $('.scav-itemfound-result-label');
                        $resultLabel.text('Sweet!').toggleClass('sweet');
                        $resultLabel.transition({ scale: 3 }, 1)
                                    .transition( { scale: 1, opacity: 1 });

                        // Update the heads-up and header running totals.
                        // Some values are going to come back null if the player didn't
                        // find the item.  There is no info to update on things like
                        // point total if they didn't find it.  So we're going to
                        // check for null, and update if it isn't for a couple-three
                        // of these.
                        if(data.currentPointTotal)
                          view.popTextChange($headsUpPointTotal, data.currentPointTotal);

                        // If the last item the player attempted to find changed,
                        // animate the new one in
                        var recentItemName = $headsUpItemName.text();

                        if(data.recentScavItemName != recentItemName)
                          view.scrollTextChange($headsUpItemName, data.recentScavItemName);

                        if(data.currentScavItemsFoundTotal)
                          view.popTextChange($foundTotal, data.currentScavItemsFoundTotal);

                        if(data.currentScavItemsLeftTotal || data.currentScavItemsLeftTotal == 0)
                          view.popTextChange($leftTotal, data.currentScavItemsLeftTotal);

                        $('div.scav-item-camera-cta.new-picture').fadeOut();

                        // Display the message and the go-back cta
                        $('.scav-item-camera-gobackafterattempt-action').fadeIn();
                     });
      },

      showCameraViewNotFound: function(data)
      {
        var view = this;
        var $headsUpItemName = $('.scav-headsup-itemname-label');

        var $operatorIcon = $('.scav-item-operator-icon');

        if(!$operatorIcon.hasClass('not-equals'))
          $operatorIcon.toggleClass('not-equals');

        if(!$('div.scav-item-camera-cta').hasClass('retake-picture'))
        {
          // Show the not equals operator
          $operatorIcon.transition({ scale: 0 })
                       .transition({ scale: 1.8, opacity: 1 })
                       .transition({ scale: 1.0 }, 200, 'snap', function() {

                         var $resultLabel = $('.scav-itemfound-result-label');

                         $resultLabel.text('Bummer!').toggleClass('bummer');

                         $resultLabel.transition({ scale: 3 }, 1)
                                     .transition( { scale: 1, opacity: 1 });

                         // If the last item the player attempted to find changed,
                         // animate the new one in
                         var recentItemName = $headsUpItemName.text();

                         if(data.recentScavItemName != recentItemName)
                           view.scrollTextChange($headsUpItemName, data.recentScavItemName);


                         $('div.scav-item-camera-cta').fadeOut(function() {
                           $(this).removeClass('new-picture').addClass('retake-picture');
                           $(this).fadeIn();
                         });

                         // Display the message and the go-back cta
                         $('.scav-item-camera-gobackafterattempt-action').fadeIn();
                       });
        }
        else // Assuming this is a retry, so re-run the operator and result message animation again
        {
          $operatorIcon.transition({ scale: 0 })
                       .transition({ scale: 1.8, opacity: 1 })
                       .transition({ scale: 1.0 }, 200, 'snap', function() {

                         var $resultLabel = $('.scav-itemfound-result-label');
                         $resultLabel.text('Bummer!').toggleClass('bummer');
                         $resultLabel.transition({ scale: 3 }, 1)
                                     .transition( { scale: 1, opacity: 1 });
                       });
        }
      },

      updateScavGameComplete: function(data)
      {
        // Do the update
        this.updateCameraViewWithResult(data);

        // Kill the timer and update the message
        $('.scav-timer').countdown('destroy');
        $('.scav-timer').html('<p class="scav-timer-label">SCAVHN\'D!!</p>')
          .transition({ scale: 1.6 }, 200, 'snap')
          .transition({ scale: 1.0 });

        // Disable picture taking CTA
        $('input[type=file]').prop('disabled', true);
      },

      // Helper methods
      startTimer: function()
      {
        $('.scav-timer').countdown({
          until: this.viewData.expiryDate,
          compact: true,
          layout: '<p class="scav-timer-label">{hnn}{sep}{mnn}{sep}{snn}</p>',
          description: '',
          onExpiry: this.gameOver
        });
      },

      gameOver: function()
      {
        Debug.log('Time\'s up!');

        $('.scav-timer p').transition({ opacity: 0, duration: 200 }, function() {
          this.addClass('game-over');
          this.text('GAME OVER.').transition({ opacity: 1, duration: 200 });
        });

        // Add blur-out effect
        $('.scav-listitems').addClass('game-over-disabled');
        $('.scav-cameraview').addClass('game-over-disabled');

        // Disable picture taking CTA
        $('input[type=file]').prop('disabled', true);
      },

      restoreGoBackCta: function ()
      {
        var $scavCameraGoBackAfterAttemptCta = $('.scav-item-camera-gobackafterattempt-action');
        if ($scavCameraGoBackAfterAttemptCta.is(':visible'))
          $scavCameraGoBackAfterAttemptCta.hide();
      },

      restoreCameraCta: function ()
      {
        var $scavCameraCta = $('.scav-item-camera-cta');
        if ($scavCameraCta.hasClass('retake-picture')) {
          $scavCameraCta.removeClass('retake-picture')
            .addClass('new-picture');
        }

        if (!$scavCameraCta.is(':visible'))
          $scavCameraCta.show();
      },

      restoreScavItemCameraResultView: function () {
        var $scavCameraResultView = $('.scav-camera-result-view');

        if ($scavCameraResultView.is(':visible'))
        {
          $scavCameraResultView.hide();

          this.restoreOperatorIconAndResultMessage();

          $('.scav-camera-initial-view').show();
        }
      },

      restoreOperatorIconAndResultMessage: function () {
        var $operatorIcon = $('.scav-item-operator-icon');
        if ($operatorIcon.hasClass('equals')) {
          $operatorIcon.toggleClass('equals');
          $operatorIcon.css('opacity', 0);
        }

        if ($operatorIcon.hasClass('not-equals')) {
          $operatorIcon.toggleClass('not-equals');
          $operatorIcon.css('opacity', 0);
        }

        var $resultLabel = $('.scav-itemfound-result-label');
        $resultLabel.css('opacity', 0);
        $resultLabel.text('');

        if ($resultLabel.hasClass('sweet'))
          $resultLabel.toggleClass('sweet');

        if ($resultLabel.hasClass('bummer'))
          $resultLabel.toggleClass('bummer');
      },

      popTextChange: function(jQueryElement, textValue)
      {
        jQueryElement.text(textValue)
          .transition({ scale: 1.6 }, 200, 'snap')
          .transition({ scale: 1.0 });
      },

      scrollTextChange: function(jQueryElement, textValue)
      {
        jQueryElement.transition({ y: 19 }, 100, 'snap', function() {
          this.text(textValue)
            .transition({ opacity: 0 }, 1)
            .transition({ y: -33 }, 1, 'linear')
            .transition({ opacity: 1 }, 1)
            .transition({ y: 0 }, 100, 'ease');
        });
      }
    });
  }
);