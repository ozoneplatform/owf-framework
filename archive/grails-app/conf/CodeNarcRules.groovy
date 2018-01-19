ruleset {

    description '''
        Our CodeNarc rule set.  Contains most rules, but excludes the follow subsets completely:

        formatting.xml
        generic.xml
        jdbc.xml
        size.xml

        Some other individual rules have been omitted as well.  Refer to the CodeNarc documentation
        or view http://codenarc.sourceforge.net/StarterRuleSet-AllRulesByCategory.groovy.txt for
        the full list.
        '''

    // rulesets/basic.xml
    AssertWithinFinallyBlock 
    AssignmentInConditional 
    BitwiseOperatorInConditional
    BooleanGetBoolean 
    BrokenNullCheck 
    BrokenOddnessCheck 
    ClassForName 
    ComparisonOfTwoConstants 
    ComparisonWithSelf 
    ConstantAssertExpression 
    ConstantIfExpression 
    ConstantTernaryExpression 
    DeadCode 
    DoubleNegative 
    DuplicateCaseStatement 
    DuplicateMapKey 
    DuplicateSetValue 
    EmptyCatchBlock 
    EmptyElseBlock 
    EmptyFinallyBlock 
    EmptyForStatement 
    EmptyIfStatement 
    EmptyInstanceInitializer 
    EmptyMethod 
    EmptyStaticInitializer 
    EmptySwitchStatement 
    EmptySynchronizedStatement 
    EmptyTryBlock 
    EmptyWhileStatement 
    EqualsAndHashCode 
    EqualsOverloaded 
    ExplicitGarbageCollection 
    ForLoopShouldBeWhileLoop 
    HardCodedWindowsFileSeparator 
    HardCodedWindowsRootDirectory 
    IntegerGetInteger 
    RandomDoubleCoercedToZero 
    RemoveAllOnSelf 
    ReturnFromFinallyBlock 
    ThrowExceptionFromFinallyBlock 
    
    // rulesets/braces.xml
    ForStatementBraces
    WhileStatementBraces
    
    // rulesets/concurrency.xml
    BusyWait 
    DoubleCheckedLocking 
    InconsistentPropertySynchronization
    NestedSynchronization
    StaticCalendarField 
    StaticConnection 
    StaticDateFormatField 
    StaticMatcherField 
    StaticSimpleDateFormatField 
    SynchronizedMethod 
    SynchronizedOnBoxedPrimitive 
    SynchronizedOnGetClass 
    SynchronizedOnReentrantLock 
    SynchronizedOnString 
    SynchronizedOnThis 
    SynchronizedReadObjectMethod 
    SystemRunFinalizersOnExit 
    ThreadGroup 
    ThreadLocalNotStaticFinal 
    ThreadYield 
    UseOfNotifyMethod 
    VolatileArrayField 
    VolatileLongOrDoubleField 
    WaitOutsideOfWhileLoop 
    
    // rulesets/convention.xml
    ConfusingTernary 
    HashtableIsObsolete
    InvertedIfElse
    LongLiteralWithLowerCaseL 
    ParameterReassignment 
    VectorIsObsolete
    
    // rulesets/design.xml
    AbstractClassWithPublicConstructor 
    AbstractClassWithoutAbstractMethod 
    BooleanMethodReturnsNull 
    CloneableWithoutClone
    CloseWithoutCloseable 
    CompareToWithoutComparable 
    ConstantsOnlyInterface 
    EmptyMethodInAbstractClass 
    FinalClassWithProtectedMember 
    ImplementationAsType 
    PrivateFieldCouldBeFinal 
    PublicInstanceField 
    ReturnsNullInsteadOfEmptyArray 
    ReturnsNullInsteadOfEmptyCollection 
    SimpleDateFormatMissingLocale 
    StatelessSingleton 
    
    // rulesets/dry.xml
    DuplicateNumberLiteral

    // rulesets/exceptions.xml
    CatchArrayIndexOutOfBoundsException 
    CatchError 
    CatchException 
    CatchIllegalMonitorStateException 
    CatchIndexOutOfBoundsException 
    CatchNullPointerException 
    CatchRuntimeException 
    CatchThrowable 
    ConfusingClassNamedException 
    ExceptionExtendsError 
    //ExceptionNotThrown
    MissingNewInThrowStatement 
    ReturnNullFromCatchBlock 
    SwallowThreadDeath 
    ThrowError 
    ThrowException 
    ThrowNullPointerException 
    ThrowThrowable
    
    // rulesets/grails.xml
    GrailsDomainHasEquals 
    GrailsDomainHasToString 
    GrailsServletContextReference 

    // rulesets/imports.xml
    DuplicateImport
    ImportFromSamePackage
    ImportFromSunPackages
    UnusedImport

    // rulesets/junit.xml
    ChainedTest 
    CoupledTestCase 
    JUnitAssertAlwaysFails 
    JUnitAssertAlwaysSucceeds 
    //JUnitLostTest
    JUnitPublicNonTestMethod 
    JUnitSetUpCallsSuper 
    JUnitTearDownCallsSuper
    JUnitTestMethodWithoutAssert 
    JUnitUnnecessarySetUp 
    JUnitUnnecessaryTearDown 
    //JUnitUnnecessaryThrowsException
    SpockIgnoreRestUsed 
    UnnecessaryFail 
    UseAssertEqualsInsteadOfAssertTrue 
    UseAssertFalseInsteadOfNegation 
    UseAssertNullInsteadOfAssertEquals 
    UseAssertSameInsteadOfAssertTrue 
    UseAssertTrueInsteadOfAssertEquals 
    UseAssertTrueInsteadOfNegation 
    
    // rulesets/logging.xml
    LoggerForDifferentClass 
    LoggerWithWrongModifiers 
    LoggingSwallowsStacktrace 
    MultipleLoggers 
    PrintStackTrace 
    Println 
    SystemErrPrint 
    SystemOutPrint 
    
    // rulesets/naming.xml
    ConfusingMethodName
    ObjectOverrideMisspelledMethodName

    // rulesets/security.xml
    FileCreateTempFile 
    InsecureRandom 
    JavaIoPackageAccess 
    NonFinalPublicField 
    NonFinalSubclassOfSensitiveInterface 
    ObjectFinalize 
    PublicFinalizeMethod 
    SystemExit 
    UnsafeArrayDeclaration 
    
    // rulesets/serialization.xml
    SerialPersistentFields 
    SerialVersionUID 
    SerializableClassMustDefineSerialVersionUID 
    
    // rulesets/unnecessary.xml
    AddEmptyString 
    ConsecutiveLiteralAppends 
    ConsecutiveStringConcatenation 
    UnnecessaryBigDecimalInstantiation 
    UnnecessaryBigIntegerInstantiation 
    UnnecessaryBooleanExpression 
    UnnecessaryBooleanInstantiation 
    UnnecessaryCallToSubstring
    UnnecessaryCatchBlock 
    UnnecessaryConstructor
    UnnecessaryDoubleInstantiation
    UnnecessaryFinalOnPrivateMethod
    UnnecessaryFloatInstantiation 
    UnnecessaryIfStatement
    UnnecessaryInstanceOfCheck 
    UnnecessaryInstantiationToGetClass 
    UnnecessaryIntegerInstantiation 
    UnnecessaryLongInstantiation 
    UnnecessaryModOne 
    UnnecessaryNullCheckBeforeInstanceOf
    UnnecessaryObjectReferences 
    UnnecessaryOverridingMethod 
    UnnecessaryPackageReference 
    UnnecessaryParenthesesForMethodCallWithClosure 
    UnnecessarySelfAssignment
    UnnecessaryStringInstantiation
    UnnecessarySubstring 
    UnnecessaryTernaryExpression 
    UnnecessaryTransientModifier 
    
    // rulesets/unused.xml
    UnusedArray 
    UnusedMethodParameter 
    UnusedObject 
    UnusedPrivateField 
    UnusedPrivateMethod 
    UnusedPrivateMethodParameter 
    UnusedVariable 
 }