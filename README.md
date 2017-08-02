# Almost slido

The purpose of this app is to give you an end-to-end demo of a full-stack web application with as little code as possible.

This project is part of a talk on "Full stack web development: introduction and architecture". You can get the slides for that presentation [here](https://docs.google.com/presentation/d/13JmF5QTcGRlEulsf8M1p5Tyg7vDz-AXww15cBgl6x5g/edit?usp=sharing).

# Code structure

This project is split into two parts:

1. the client: [almost-slido.js](https://github.com/ricokahler/almost-slido/blob/master/public/almost-slido.js)
2. the server: [index.js](https://github.com/ricokahler/almost-slido/blob/master/index.js)

There are two resources on the server which is `/api/questions` and `/api/likes`. Both resources support HTTP request methods `GET`, `POST`, `PUT`, and `DELETE`.

The client simply uses those methods to persist data on the server.

The server *does not* use a database and simply stores everything in memory. Once server is restarted, all the data is lost.

# Live demo

The live demo is available from heroku [here](https://polar-hollows-69274.herokuapp.com/).

# Where to go next

If you haven't already please see the slides that go along this presentation [here](https://docs.google.com/presentation/d/13JmF5QTcGRlEulsf8M1p5Tyg7vDz-AXww15cBgl6x5g/edit?usp=sharing).

After that see [this google doc on where to learn more](https://goo.gl/sZ2KrT).

Thank you!