### **Unit Tests in Serverless**
So we have some simple business logic that figures out exactly how much to charge our user based on the number of notes they want to store. We want to make sure that we test all the possible cases for this before we start charging people. To do this we are going to configure unit tests for our Serverless Framework project.

We are going to use [Jest](https://facebook.github.io/jest/) for this and it is already a part of [my starter project](https://github.com/eksant/serverless-react-aws/tree/master/serverless-nodejs-starter).

However, if you are starting a new Serverless Framework project. Add Jest to your dev dependencies by running the following.

```
$ npm install --save-dev jest
```

And update the scripts block in your package.json with the following:

```
"scripts": {
  "test": "jest"
},
```

This will allow you to run your tests using the command npm test.

#### Add Unit Tests
Now create a new file in tests/billing.test.js and add the following.

```
import { calculateCost } from "../libs/billing-lib";

test("Lowest tier", () => {
  const storage = 10;

  const cost = 4000;
  const expectedCost = calculateCost(storage);

  expect(cost).toEqual(expectedCost);
});

test("Middle tier", () => {
  const storage = 100;

  const cost = 20000;
  const expectedCost = calculateCost(storage);

  expect(cost).toEqual(expectedCost);
});

test("Highest tier", () => {
  const storage = 101;

  const cost = 10100;
  const expectedCost = calculateCost(storage);

  expect(cost).toEqual(expectedCost);
});
```

This should be straightforward. We are adding 3 tests. They are testing the different tiers of our pricing structure. We test the case where a user is trying to store 10, 100, and 101 notes. And comparing the calculated cost to the one we are expecting. You can read more about using Jest in the [Jest docs here](https://facebook.github.io/jest/docs/en/getting-started.html).

#### Run tests
And we can run our tests by using the following command in the root of our project.

```
$ npm test
```

You should see something like this:

```
> jest

 PASS  tests/billing.test.js
  ✓ Lowest tier (4ms)
  ✓ Middle tier
  ✓ Highest tier (1ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        1.665s
Ran all test suites.
```

And that’s it! We have unit tests all configured.

#### Commit the Changes
Let’s commit these changes.

```
$ git add .
$ git commit -m "Adding unit tests"
```

#### Push the Changes
We are done making changes to our project, so let’s go ahead and push them to GitHub.

```
$ git push
```

Next we’ll use our Git repo to automate our deployments. This will ensure that when we push our changes to Git, it will run our tests, and deploy them for us automatically. We’ll also learn to configure multiple environments.


[[Back]](https://github.com/eksant/serverless-react-aws)
