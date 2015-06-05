package org.grails.plugins.metrics.groovy.ast

import org.codehaus.groovy.ast.stmt.ExpressionStatement
import org.codehaus.groovy.control.CompilePhase
import org.codehaus.groovy.control.SourceUnit
import org.codehaus.groovy.transform.ASTTransformation
import org.codehaus.groovy.transform.GroovyASTTransformation
import org.grails.plugins.metrics.groovy.Metrics

import java.lang.reflect.Modifier

import org.codehaus.groovy.ast.*
import org.codehaus.groovy.ast.expr.*

@GroovyASTTransformation(phase=CompilePhase.CANONICALIZATION)
public class YMeteredASTTransformation implements ASTTransformation {

    public void visit(ASTNode[] nodes, SourceUnit sourceUnit) {
        if((!nodes) || (!nodes[0]) || (!nodes[1]) || (!(nodes[0] instanceof AnnotationNode)) || (!(nodes[1] instanceof MethodNode))) {
            throw new RuntimeException("Internal error: wrong types: $nodes/ $sourceUnit")
        }
        AnnotationNode annotationNode = nodes[0]
        MethodNode methodNode = nodes[1]
        String meterName = ensureMeterConfigured(annotationNode, methodNode.declaringClass, methodNode)
        makeMeteredMethod(meterName, methodNode)
    }

    private void makeMeteredMethod(String meterName, MethodNode methodNode){
        try {
            def meterCall = new ExpressionStatement (new MethodCallExpression(new VariableExpression(meterName), "mark", new ArgumentListExpression() ) )
            //Add meter call
            methodNode.code.statements.add(0, meterCall)
        } catch (Throwable t) {
            //Not sure that this ia appropriate, but this WILL stop the build which IS what I want
            throw new RuntimeException("Unable to execute AST Transformation", t)
        }
    }

    private String ensureMeterConfigured(AnnotationNode annotationNode, ClassNode classNode, MethodNode  methodNode){

        String meterName = "${methodNode.name}Meter".toString()
        //The meter name can be configured from the @Metered Annotation.
        def annotationName =  annotationNode.getMember('name')
        if(annotationName && (annotationName in ConstantExpression) && annotationName.value){
            meterName = ((ConstantExpression)annotationName).value
        }

        //Allowing the code author to define their own meter, we only write a new one if it was not found.
        if(!methodNode.declaringClass.fields.find{it.name == meterName}){
            FieldNode timerField = new FieldNode(
                    meterName,
                    Modifier.PRIVATE,
                    new ClassNode(com.codahale.metrics.Meter.class),
                    new ClassNode(classNode.getClass()),
                    new StaticMethodCallExpression(
                            new ClassNode(Metrics.class),
                            'newMeter',
                            new ArgumentListExpression([
                                    new ConstantExpression(meterName),
                            ])
                    ) )
            classNode.addField(timerField)
        }
        return meterName
    }
}
