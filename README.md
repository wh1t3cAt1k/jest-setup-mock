# jest-setup-mock

Return / resolve values only if the arguments match the provided values. Full TypeScript type safety.

# Rationale

Have you ever wanted to setup a Jest mock to return a value **only** when it received the correct arguments? 

Sure, you could've accessed `mockVariable.mock.calls` besides your original assert, but that just makes your test code bloated and noisy.

With `jest-setup-mock`, you can set up the mock to return / resolve a value **only** when the arguments match the expected arguments that you specify:

```
setupMock(mockVariable)
    .expectArguments(expectedArg1, ..., expectedArgN)
    .resolveValueOnce(true)
```

The code above will result in the mock resolving `true` whenever it is called with arguments matching `[expectedArg1, ..., expectedArgN]`, and throwing a descriptive error otherwise.

Furthermore, if you type your mock variable as `FunctionMock<ActualFunctionType>`, the types of arguments and return values in the above fluent syntax will be inferred correctly, guarding you from type mistakes.

For reference, `lodash`'s [`isEqual`|https://lodash.com/docs/4.17.11#isEqual] method is used to check for expected / actual argument equality.

# Contributing

Pull requests are accepted.