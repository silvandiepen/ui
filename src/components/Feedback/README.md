# Feedback

`UIFeedback` is the namespace export for the shared feedback system. It groups the mounted feedback shell together with popup, toast, and tooltip-related surfaces.

## Scope

- `Popup` service-driven modal orchestration
- shared `Toast` notification helpers and container
- shared `Tooltip` exports, plus alternate exports such as `ToolTip`

## What It Does

- Mounts the shell components that feedback services render into.
- Gives app-level surfaces a single place to host popups and transient notifications.
- Acts as the namespace page for the feedback-related exports rather than one standalone UI widget.

## Docs Structure

Use the nested docs pages for the concrete surfaces. The root `Feedback` page is only the namespace overview.
