interface FunctionalLanguageInterface {
    run: Function
}

const FLang: FunctionalLanguageInterface = {
    run: (()=>"returns")
}

export default FLang;