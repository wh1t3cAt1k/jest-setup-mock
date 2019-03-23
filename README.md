# jest-setup-mock

Return / resolve values only if the arguments match the provided values. Full TypeScript type safety.

# Rationale

Have you ever wanted to setup a Jest mock to return a value **only** when it received the correct arguments? 

Sure, you could access `mockVariable.mock.calls` and assert its contents besides your original assert, but to my taste that is a pretty low-level API that furthermore makes your test code bloated and noisy.

With `jest-setup-mock`, you can set up the mock to return / resolve a value **only** when the arguments match the expected arguments that you specify:

```
let someFunction: (x: number, y: string) => Promise<boolean>;
let functionMock: FunctionMock<typeof someFunction>;

setupMock(someFunction)
    .expectArguments(42, 'is the answer')
    .resolveValueOnce(true);
```

The code above will result in the mock resolving `true` whenever it is called with two arguments matching `[42, 'is the answer']`, and throwing a descriptive error otherwise.

Furthermore, by typing your mock variable as `FunctionMock<ActualFunctionType>`, the types of arguments and return values in the above fluent syntax will be inferred correctly, guarding you from type mistakes.

For reference, `lodash`'s [`isEqual`](https://lodash.com/docs/4.17.11#isEqual) method is used to check for expected / actual argument equality, so deep object / array equality comparison will work.

# Contributing

Pull requests are accepted.