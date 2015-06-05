package org.grails.plugins.metrics.groovy.ast

import com.codahale.metrics.Timer
import org.codehaus.groovy.ast.*
import org.codehaus.groovy.ast.expr.*
import org.codehaus.groovy.ast.stmt.BlockStatement
import org.codehaus.groovy.ast.stmt.ExpressionStatement
import org.codehaus.groovy.ast.stmt.TryCatchStatement
import org.codehaus.groovy.control.CompilePhase
import org.codehaus.groovy.control.SourceUnit
import org.codehaus.groovy.syntax.Token
import org.codehaus.groovy.syntax.Types
import org.codehaus.groovy.transform.ASTTransformation
import org.codehaus.groovy.transform.GroovyASTTransformation
import org.grails.plugins.metrics.groovy.Metrics

import java.lang.reflect.Modifier

@GroovyASTTransformation(phase=CompilePhase.CANONICALIZATION)
public class YTimedASTTransformation implements ASTTransformation {

    public void visit(ASTNode[] nodes, SourceUnit sourceUnit) {
        if((!nodes) || (!nodes[0]) || (!nodes[1]) || (!(nodes[0] instanceof AnnotationNode)) || (!(nodes[1] instanceof MethodNode))) {
            throw new RuntimeException("Internal error: wrong types: $nodes/ $sourceUnit")
        }
        AnnotationNode annotationNode = nodes[0]
        MethodNode methodNode = nodes[1]
        String timerName = ensureTimerConfigured(annotationNode, methodNode.declaringClass, methodNode)
        makeTimedMethod(timerName, methodNode.declaringClass, methodNode)
    }

    private void makeTimedMethod(String timerName, ClassNode classNode, MethodNode methodNode){
        try {
            String contextVariableName = "ctx${timerName}".toString()
            //Create a new method, containing the code from the method we are visiting, add to classNode
            //Note that the new method is private since there is no expectation for clients to call it directly
            def newMethodNode = new MethodNode("_do_${methodNode.name}", Modifier.PRIVATE, methodNode.returnType, methodNode.parameters, methodNode.exceptions, methodNode.code )
            classNode.addMethod(newMethodNode)

            //Create a call statement to call our new method
            def methodCall = new ExpressionStatement( new MethodCallExpression(new VariableExpression('this'), "_do_${methodNode.name}", new ArgumentListExpression( methodNode.parameters ) )  )

            //Generate statement to start the timer
            def contextAssignmentStatement = new ExpressionStatement(
                    new DeclarationExpression(
                            new VariableExpression(contextVariableName),
                            Token.newSymbol(Types.EQUALS, 0, 0),
                            new MethodCallExpression(new VariableExpression(timerName), "time", new ArgumentListExpression() )
                    )
            )

            //Generate the statement to stop the timer
            def contextStopStatement = new ExpressionStatement(
                    new MethodCallExpression(
                            new VariableExpression(contextVariableName), "stop", new ArgumentListExpression()
                    )
            )

            //New Empty Block to contain method statents
            def mBlock = new BlockStatement([], new VariableScope())

            //Add start statement, outside of the try block
            mBlock.statements.add(contextAssignmentStatement)

            //Create and add try/finally, the try will consist of our original method call
            mBlock.statements.add(new TryCatchStatement(methodCall, contextStopStatement ))

            //rewrite the method
            methodNode.code = mBlock
        } catch (Throwable t) {
            //Not sure that this ia appropriate, but this WILL stop the build which IS what I want
            throw new RuntimeException("Unable to execute AST Transformation", t)
        }
    }

    private String ensureTimerConfigured(AnnotationNode annotationNode, ClassNode classNode, MethodNode  methodNode){
        String timerName = "${methodNode.name}Timer".toString()
        //The timer name can be configured from the @Timed Annotation.
        def annotationName =  annotationNode.getMember('name')
        if(annotationName && (annotationName in ConstantExpression) && annotationName.value){
            timerName = ((ConstantExpression)annotationName).value
        }

        //Allowing the code author to define their own timer, we only write a new one if it was not found.
        if(!methodNode.declaringClass.fields.find{it.name == timerName}){
            FieldNode timerField = new FieldNode(
                    timerName,
                    Modifier.PRIVATE,
                    new ClassNode(Timer.class),
                    new ClassNode(classNode.getClass()),
                    new StaticMethodCallExpression(
                            new ClassNode(Metrics.class),
                            'newTimer',
                            new ArgumentListExpression([
                                    new ConstantExpression(timerName),
                            ])
                    ) )
            classNode.addField(timerField)
        }
        return timerName

    }
}
