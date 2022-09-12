export const inputFunctionHere = (): number => {
    return 9;
}

export const functionToTestString = (inputString: string, secondInputString: string): string => {
    return inputString + "hallo" + secondInputString;
}

export const mixedInputArgs = (inputNum: number, inputString: string): boolean => {
    if (inputNum === 5 && inputString === "Five") {
        return true;
    } else {
        return false;
    }
}