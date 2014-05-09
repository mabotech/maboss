maboss
======

maboss MES platform is built on open source software and released with MIT license.

Features
===============

- session
- logging: app logging and performance logging.


Install
=======

NodeJs 0.11.12

pg install on windows

npm install --msvs_version=2012

Development
===========

Windows

start_server.bat: use nodemon to monitor files update.

-e js,json : monitor js and json config files.


----

Folders Structure
==============

- `public/components`, installed libs by bower & component
- `public/css`, global css
- `public/mabolib`, mabo js/css lib
- `public/maboss`, app folder

maboss directory:

- `admin`
- `dashboard`
- `monitor`
- `portal`
- `reports`
- `tables`

## Recommended Resources:

- [hackathon-starter](https://github.com/sahat/hackathon-starter "hackathon-starter")
- [x-editable](http://vitalets.github.io/x-editable/ "x-editable") 

Open source components: 

- NodeJS
- PostgreSQL
- Redis
- ...