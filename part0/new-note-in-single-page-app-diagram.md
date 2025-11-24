```mermaid
sequenceDiagram
    participant browser
    participant server 

    Note left of browser: User form submission

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: 201 Created (successful creation of resource, request fulfilled)
    deactivate server
```