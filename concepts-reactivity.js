// https://docs.solidjs.com/concepts/reactivity

let currentSubscriber = null;

function createSignal(value) {
  const subscribers = new Set();

  function getter() {
    if (currentSubscriber) {
      subscribers.add(currentSubscriber);
    }

    return value;
  }

  function setter(nextValue) {
    value = nextValue;

    for (const subscriber of subscribers) {
      subscriber();
    }
  }

  return [getter, setter];
}

function createEffect(fn) {
  currentSubscriber = fn;

  fn();

  currentSubscriber = null;
}

// main

const [count, setCount] = createSignal(0);

createEffect(() => {
  console.log(`The count is ${count()}`);
});

setInterval(() => {
  setCount(count() + 1);
}, 1000);
