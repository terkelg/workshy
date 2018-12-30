
const onIdle = requestIdleCallback || function (handler) {
	const start = Date.now();
	return setTimeout(() => handler({ didTimeout: false, timeRemaining: () => Math.max(0, 50 - (Date.now() - start)) }), 1);
};

function workshy() {
	const tasks = [];
	let running = false;

	const sort = () => tasks.sort((a, b) => b._priority - a._priority);
	const start = () => (onIdle(process, { timeout: 50 }), running = true);

	function process(deadline) {
		while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && tasks.length > 0) {
			const fn = tasks.shift();
			fn._scheduled = false;
			fn();
		}
		tasks.length > 0 ? start() : running = false;
	}

	function run(fn) {
		if (!fn._scheduled) {
			tasks.push(fn);
			fn._scheduled = true;
			fn._priority = 0;
		} else {
			fn._priority++;
			sort();
		}

		if (tasks.length && !running) start();
	}

	return function(fn, {force = false, priority = 0} = {}) {
		return () => {
			if (force) {
				fn._scheduled = false;
				fn();
			} else if (!fn._scheduled) {
				tasks.push(fn);
				fn._scheduled = true;
				fn._priority = priority;
				priority !== 0 && sort();
			} else {
				fn._priority++;
				sort()
			}

			if (tasks.length && !running) start();
		}
	}
}

export default workshy();
