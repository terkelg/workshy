# workshy [![Build Status](https://travis-ci.org/terkelg/workshy.svg?branch=master)](https://badgen.now.sh/npm/v/workshy) [![Version](https://badgen.now.sh/npm/v/workshy)](https://npmjs.com/package/workshy)

> A small (354B) lazy function scheduler for a butter smooth main thread

Async rendering/micro-tasks can still block paint and input because complex UIs can take long to render. Render should be under `10ms` for a smooth `60fps` experience.

Workshy is a tiny (354B) helper that ensure non-blocking rendering and responsive UIs. This is is done by breaking up tasks into smaller chunks executed over multiple frames to ensure smooth updates.

This module is available in three formats:

* **ES Module**: `dist/workshy.mjs`
* **CommonJS**: `dist/workshy.js`
* **UMD**: `dist/workshy.min.js`


## Install

```
$ npm install --save workshy
```

The script can also be directly included from [unpkg.com](https://unpkg.com/workshy):
```html
<script src="https://unpkg.com/workshy"></script>
```


## Usage

```js
import workshy from 'workshy';

// dummy function doing heavy work
const greet = () => 'hello world';

// queue and call function
workshy(greet)();
// => 'hello world'

// tasks are only called once, but
// multiple calls increases priority
const a = workshy(() => console.log('A'));
const b = workshy(() => console.log('B'));
b();
a();
a();
// => A, B

// manually define priority
const func = workshy(greet, {priority: 2});

// force it to be called immediately
const func = workshy(greet, {force: true});

// workshy distribute the work over time to
// make sure the main thread runs butter smooth
for (let i = 0; i < 5000; i++) {
  workshy(greet)(); // => this won't block UI
}

```


## API

### workshy(task, [options])
Returns: `function`

#### task
Type: `function`

Call returned function to queue task. It will be called as soon as possible.

> **Important:** Task are only called _once_.<br> Calling the same task multiple times just increases its priority.

#### options.priority
Type: `Number`<br>
Default: `0`

Tasks are sorted by priority. Default are

> **Important:** Priority also increas if a taks is called multiple times.

```js
workshy(() => console.log('Hello World'), {force: false, priority: 2});
//=> 'Hello World'
```

#### options.force
Type: `Boolean`<br>
Default: `false`

```js
workshy(() => console.log('Hello World'), {force: false, priority: 2});
//=> 'Hello World'
```


## Inspiration

This is inspired by the talk [The Virtue of Laziness: Leveraging Incrementality for Faster Web UI](https://youtu.be/ypPRdtjGooc?t=510)


## License

MIT © [Terkel Gjervig](https://terkel.com)
