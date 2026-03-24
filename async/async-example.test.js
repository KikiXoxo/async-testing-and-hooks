import { expect, it } from 'vitest';
import { generateToken, generateTokenPromise } from './async-example';

// it('should generate a token value', () => {
//   const testUserEmail = 'test@test.com';

//   generateToken(testUserEmail, (err, token) => {
//     expect(token).toBeDefined();
//   });
// });

// For async functions however, the above is not enough as it will falsly show the tests as passing. If we had written expect(token).toBe(2) as our assertion instead which is clearly false, the test would still show as passing.

// This is because as an async function (one that uses callback specfically, like in this case), this is the flow order

// Vitest starts test
// → generateToken called
// → test function ends
// → Vitest marks test as done
// → callback runs later
// → assertion runs too late

// So instead, you actually need to add a parameter called done as so

it('should generate a token value', done => {
  const testUserEmail = 'test@test.com';

  generateToken(testUserEmail, (err, token) => {
    try {
      expect(token).toBeDefined();
      // expect(token).toBe(2);
      done();
    } catch (err) {
      done(err);
    }
  });
});
// Adding the done parameter lets Vitest know not to finish the test until done() is called. So the flow now becomes
// Vitest starts test
// → generateToken called
// → test waits
// → callback runs
// → assertion runs
// → done() called
// → Vitest finishes test

// try/catch is needed specifically to be able to catch errors in instances in which your test might fail. Without it, if a test failed eg when we set our assertion as expect(token).toBe(2), it would show as failed, but we would only see a timeout error is why, not the real cause
// So doing it this way makes seure any error is caught by the catch block, and then done(err) forwards that error to Vitest, so the test shows as failed, and with the correct reason

// Testing code with promises
// 1.
it('should generate a token value', () => {
  const testUserEmail = 'test@test.com';

  return expect(generateTokenPromise(testUserEmail)).resolves.toBeDefined();
});

// 2.
it('should generate a token value', async () => {
  const testUserEmail = 'test@test.com';

  const token = await generateTokenPromise(testUserEmail);

  expect(token).toBeDefined();
});
// Both methods above work for when you are dealing with promises. you can either uses .resolves, or async/await. These are preferred over the initial callback one
// Also remember if you use the .resolves method, you must return the promise assertion. No need when you are using the async/await method though, as any function annoated with async returns a promise implicitly
