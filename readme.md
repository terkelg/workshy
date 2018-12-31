# workshy [![Build Status](https://travis-ci.org/terkelg/workshy.svg?branch=master)](https://badgen.now.sh/npm/v/workshy) [![Version](https://badgen.now.sh/npm/v/workshy)](https://npmjs.com/package/workshy)

> A small (371B) lazy function scheduler for a butter smooth main thread

Workshy is a `throttle` utility that **rate limit**,  **queue**, and **distribute** function executions over time to prevent the main thread from becoming unresponsive.

Unlike a standard throttle function, and to ensure non-blocking rendering and responsive UIs, `workshy` break up functions into smaller chunks executed over time if necessary.

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
const a = workshy(x => console.log(`A: ${x}`));
const b = workshy(x => console.log(`B: ${x}`));
b(1);
a(1);
a(2);
// => A: 2
// => B: 1

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

Aaccepts any function a returns a `function` (a function that wraps your original function). Call returned function to queue task.

The returned `function` will execute your function with the latest arguments provided to it as soon as possible based on queue length and prioroty.

> **Important:** Task are only called _once_.<br> Calling the same task multiple times increases its priority.

#### options.priority
Type: `Number`<br>
Default: `0`

Tasks are sorted by priority. Functions with high porprty are called first.

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
