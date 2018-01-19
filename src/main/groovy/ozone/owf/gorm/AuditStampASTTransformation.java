package ozone.owf.gorm;

import org.codehaus.groovy.ast.ASTNode;
import org.codehaus.groovy.ast.ClassNode;
import org.codehaus.groovy.ast.FieldNode;
import org.codehaus.groovy.ast.expr.*;
import org.codehaus.groovy.ast.stmt.BlockStatement;
import org.codehaus.groovy.ast.stmt.ExpressionStatement;
import org.codehaus.groovy.ast.stmt.Statement;
import org.codehaus.groovy.control.CompilePhase;
import org.codehaus.groovy.control.SourceUnit;
import org.codehaus.groovy.transform.ASTTransformation;
import org.codehaus.groovy.transform.GroovyASTTransformation;
import ozone.owf.grails.domain.Person;

import java.lang.reflect.Modifier;
import java.util.Date;
import java.util.List;


/**
 * Performs an AST transformation on a class - adds createdBy/createdDate editedBy/EditedDate id and table
 * properties to the subject class.
 */
@GroovyASTTransformation(phase = CompilePhase.SEMANTIC_ANALYSIS)
public class AuditStampASTTransformation implements ASTTransformation {

    private static final String CREATED_BY_PROPERTY = "createdBy";
    private static final String CREATED_DATE_PROPERTY = "createdDate";

    private static final String EDITED_BY_PROPERTY = "editedBy";
    private static final String EDITED_DATE_PROPERTY = "editedDate";

    public void visit(ASTNode[] astNodes, SourceUnit sourceUnit) {
        for (ASTNode astNode : astNodes) {
            if (!(astNode instanceof ClassNode)) continue;

            ClassNode classNode = (ClassNode) astNode;

            Expression now = new ConstructorCallExpression(new ClassNode(Date.class), MethodCallExpression.NO_ARGUMENTS);

            classNode.addProperty(CREATED_BY_PROPERTY, Modifier.PUBLIC, new ClassNode(Person.class), ConstantExpression.NULL, null, null);
            addNullableConstraint(classNode, CREATED_BY_PROPERTY);

            classNode.addProperty(CREATED_DATE_PROPERTY, Modifier.PUBLIC, new ClassNode(Date.class), now, null, null);
            addNullableConstraint(classNode, CREATED_DATE_PROPERTY);

            classNode.addProperty(EDITED_BY_PROPERTY, Modifier.PUBLIC, new ClassNode(Person.class), ConstantExpression.NULL, null, null);
            addNullableConstraint(classNode, EDITED_BY_PROPERTY);

            classNode.addProperty(EDITED_DATE_PROPERTY, Modifier.PUBLIC, new ClassNode(Date.class), now, null, null);
            addNullableConstraint(classNode, EDITED_DATE_PROPERTY);

            classNode.addInterface(new ClassNode(HasAuditStamp.class));
        }
    }

    private void addNullableConstraint(ClassNode classNode, String fieldName) {
        FieldNode closure = classNode.getDeclaredField("constraints");

        if (closure == null) return;

        ClosureExpression exp = (ClosureExpression) closure.getInitialExpression();
        BlockStatement block = (BlockStatement) exp.getCode();

        if (hasFieldInClosure(closure, fieldName)) return;

        NamedArgumentListExpression namedarg = new NamedArgumentListExpression();
        namedarg.addMapEntryExpression(new ConstantExpression("nullable"), new ConstantExpression(true));
        MethodCallExpression constExpr = new MethodCallExpression(
                VariableExpression.THIS_EXPRESSION,
                new ConstantExpression(fieldName),
                namedarg
        );
        block.addStatement(new ExpressionStatement(constExpr));
    }


    public boolean hasFieldInClosure(FieldNode closure, String fieldName) {
        if (closure == null) return false;

        ClosureExpression exp = (ClosureExpression) closure.getInitialExpression();
        BlockStatement block = (BlockStatement) exp.getCode();
        List<Statement> ments = block.getStatements();
        for (Statement expstat : ments) {
            if (expstat instanceof ExpressionStatement && ((ExpressionStatement) expstat).getExpression() instanceof MethodCallExpression) {
                MethodCallExpression methexp = (MethodCallExpression) ((ExpressionStatement) expstat).getExpression();
                ConstantExpression conexp = (ConstantExpression) methexp.getMethod();
                if (conexp.getValue().equals(fieldName)) {
                    return true;
                }
            }
        }
        return false;
    }

}
