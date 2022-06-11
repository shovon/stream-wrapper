import assert = require("assert");
import StreamAsyncIterable from "./main";

const iterable = new StreamAsyncIterable<number>();

let excessInvocation = 0;
iterable.addOnExcessListener((value) => {
  excessInvocation++;
});

let count = 0;
function loop() {
  setTimeout(() => {
    count++;
    if (count < 500) {
      iterable.emitEvent(count);
      loop();
    } else {
      iterable.end();
    }
  }, 1);
}

loop();

(async function () {
  for await (const value of iterable) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }

  assert(iterable.done);
  assert(excessInvocation === 200);
})().catch(console.error);
