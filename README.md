# iai

**iai** is a framework to build highly scalable distributable web applications with ease. **This is not a framework for creating simple web applications**. *express* is awesome and very versatile, the intent is not reinventing the wheel.

## Philosophy behind the *iai* term

The name *iai* is taken from the japanesse martial art *iaido*. Under the hood it has a deep philosophical meaning. *iaido* is the path of personal reintegration, the fight against the ego to reach the purity of mind, *The union of mental and physical entities to reach the harmony of the spirit*.

The *iai* term comes from two ideograms. *i* means spirit and *ai* means union, harmony. Together, *the spirit union* or *the spirit harmony*. The word is short, symmetric, and easy to read. It's just beautiful, and suggests quickness. This attribute built the slogan:

> **As fast as say "iai"**

## Design principles ##

### As fast as say iai ###

Developing with iai should be as fast as saying the word, once developers dived through the learning curve.

### Minimalistic and Lightweight ###

The iai module provides an api to define applications and their components, that's it. Some utility functions
are bundled too to provide the necessary logic to keep things working but they are lazy loaded so there is no
unneccesary memory usage until it is really needed.

### Fluid aka. *write less, do more*###

Chainable apis are beautiful to read. Strongly inspired by the jQuery's *"write less,do more"*, the iai api is
designed to be expresive but not verbose. The code flow is as natural as deferred promises, but based in the
standard [node.js callback convention](http://nodeguide.com/style.html#callbacks).

### Asynchronous batch processing ###

Forget the sync code logic. Each action is an async task. Each task is a function. Each function is pushed to
a heap and is called as soon as is posible *on the next loop around the event loop* (aka. `process.nextTick`),
once the previous task has been completed (aka. *"first in, first out"*).

### Easy integrable and structure independent ###

The api does not assume a project structure. The api itself is meant to programatically define the project
structure. This allows easy integration with existing tools, like express or connect. It's easy because it
does not wrap other frameworks. It's a complement to these de-facto standards.


### REST based ###

Each application components is...

### Content Management ~~System~~ Strategy ###

Your CMS should be your application, not your framework.

## In a nutshell,

iai is a way to programatically define a project structure, and access or modify
that structure on the fly.

**just from the node console!!**
