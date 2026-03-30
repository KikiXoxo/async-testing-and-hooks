import { it, expect, beforeAll, beforeEach, afterAll, afterEach } from 'vitest';

import { User } from './hooks';

// Note that classes can also be tested, like User in this case. Not only functions can be tested

// We can notice that testEmail comes up in all the tests below. And while its definition can be repeated in each test, we can also avoid this duplication completely by making it a global constant instead. Same with user

// However, we will notice after making user a global variable, the test 'should store the provided email value' fails. Instead of getting 'test@test.com', we actually get 'test2@test.com'. This is because we set user globally only once, and then after the tests are carried out sequentially (in normal JS fashion)
// So the previous test 'should update the email', already modified user.email from 'test@test.com' to 'test2@test.com', which causes the later 'should store the provided email value' test to fail

// This is where hooks come in, which are special functions provided by Vitest (also Jest). beforeAll is carried out only once before all tests are then carried out. beforeEach is carried out before each test. ANd similar logic follows for afterAll and afterEach
// You can add them directly to a file as we are doing here, or to a particular test suite in a file.
// beforeAll is good for initialization, eg instead of defining user and testEmail globally as we have here, assuming we only wanted the to apply to a specific test suite, then we could define thin in a beforeAll of that suite instead. And afterAll is good for general cleanup

const testEmail = 'test@test.com';
let user = new User(testEmail);

afterEach(() => {
  user = new User(testEmail);
});

it.concurrent('should update the email', () => {
  const newTestEmail = 'test2@test.com';

  user.updateEmail(newTestEmail);

  expect(user.email).toBe(newTestEmail);
});

it.concurrent('should have an email property', () => {
  expect(user).toHaveProperty('email');
});

it.concurrent('should store the provided email value', () => {
  expect(user.email).toBe(testEmail);
});

it.concurrent('should clear the email', () => {
  user.clearEmail();

  expect(user.email).toBe('');
});

it.concurrent(
  'should still have an email property after clearing the email',
  () => {
    user.clearEmail();

    expect(user).toHaveProperty('email');
  },
);

// Every test annotated with concurrent runs in parallel, instead of the default sequential order. Which can reduce testin time, especailly when there are a whole lot of tests.
// If you have a test suite, you can just add 'concurrent' to the 'describe'. This was, all the tests inside it will run concurrently, which is cleaner than adding 'concurrent' to each of those tests
// Note that tests stored in different files by default run in parallel. .concurrent jus helps you enforce that same behavior for tests within a single file
