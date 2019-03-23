import _ from 'lodash';

type ArgsType<T> = T extends (...args: infer A) => any ? A : never;

type GetAsyncWrappedType<TFunctionReturnType> =
    TFunctionReturnType extends PromiseLike<infer TActualReturnType>
        ? TActualReturnType
        : never;

export type FunctionMock<TFunction extends (...args: any) => any> =
    jest.Mock<ReturnType<TFunction>, ArgsType<TFunction>>;

class MockerWithArgumentChecking<TReturnType, TArguments extends any[]> {
    private readonly mock: jest.Mock<TReturnType, TArguments>;
    private expectedArguments: TArguments | undefined;

    public constructor(
        mock: jest.Mock<TReturnType, TArguments>
    ) {
        this.mock = mock;
    }

    public readonly expectArguments = (
        ...expectedArguments: TArguments
    ): MockerWithArgumentChecking<TReturnType, TArguments> => {
        if (this.expectedArguments !== undefined) {
            throw new Error(
                `This method was already called with ${_.toString(this.expectedArguments)}`
            );
        }

        this.expectedArguments = expectedArguments;

        return this;
    }

    public readonly returnValueOnce = (
        valueToReturn: TReturnType
    ) => {
        this.mock.mockImplementationOnce((...actualArguments: TArguments) => {
            this.verifyArgumentsMatchExpectedIfNeeded(actualArguments);

            return valueToReturn;
        });
    }

    public readonly returnValue = (
        valueToReturn: TReturnType
    ) => this.mock.mockImplementation(() => valueToReturn)

    public readonly resolveValue = (
        valueToResolve: GetAsyncWrappedType<TReturnType>
    ) => this.mock.mockImplementation(() => <any> Promise.resolve(valueToResolve))

    public readonly resolveValueOnce = (
        valueToReturn: GetAsyncWrappedType<TReturnType>
    ) => {
        this.mock.mockImplementation((...actualArguments: TArguments) => {
            this.verifyArgumentsMatchExpectedIfNeeded(actualArguments);

            return <any> Promise.resolve(valueToReturn);
        });
    }

    private readonly verifyArgumentsMatchExpectedIfNeeded = (actualArguments: TArguments) => {
        if (
            this.expectedArguments === undefined
            || _.isEqual(
                this.expectedArguments,
                _.take(actualArguments, this.expectedArguments.length)
            )
        ) {
            return;
        }

        const checkedArgumentsCount = this.expectedArguments.length;
        const expectedArgumentsDescription = _.toString(this.expectedArguments);
        const actualArgumentsDescription = _.toString(
            _.take(actualArguments, checkedArgumentsCount)
        );

        throw new Error(`Expected the first ${checkedArgumentsCount} arguments to be: ${expectedArgumentsDescription}, but they were: ${actualArgumentsDescription}`);
    }
}

export const setupMock =
    <TReturnType, TArguments extends any[]>(
        mock: jest.Mock<TReturnType, TArguments>
    ) => new MockerWithArgumentChecking<TReturnType, TArguments>(mock);
