// Closure

function createFuncWithClosure(closureVar) {
    const closureVarIntern = closureVar;
    const outputFunc = () => {
        return closureVarIntern;
    }
    return outputFunc;
}

delete createFuncWithClosure;

const myFunc = createFuncWithClosure(5);

{
    const closureVarIntern = 69;
    console.log(myFunc());
}

createFuncWithClosure(20);
console.log(myFunc());