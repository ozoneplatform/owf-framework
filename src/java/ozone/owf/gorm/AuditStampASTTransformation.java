package ozone.owf.gorm;

import org.codehaus.groovy.transform.ASTTransformation;
import org.codehaus.groovy.transform.GroovyASTTransformation;
import org.codehaus.groovy.control.CompilePhase;
import org.codehaus.groovy.control.SourceUnit;
import org.codehaus.groovy.ast.*;
import org.codehaus.groovy.ast.expr.*;
import org.codehaus.groovy.ast.stmt.*;
import org.codehaus.groovy.ast.expr.ConstructorCallExpression;
import ozone.owf.grails.domain.Person;
import grails.util.GrailsNameUtils;
import groovy.util.*;

import java.lang.reflect.Modifier;
import java.util.*;
import java.io.*;


/**
 * Performs an ast transformation on a class - adds createdBy/createdDate editedBy/EditedDate id and table
 * properties to the subject class.
 */
@GroovyASTTransformation(phase = CompilePhase.SEMANTIC_ANALYSIS)
public class AuditStampASTTransformation implements ASTTransformation {

	//private static final Log LOG = LogFactory.getLog(AuditStampASTTransformation.class);
	private static final ConfigObject CO = new ConfigSlurper().parse(getContents(new File("./grails-app/conf/Config.groovy")));
	private static final Properties CONF = (new ConfigSlurper().parse(getContents(new File("./grails-app/conf/Config.groovy")))).toProperties();

	static{
		//System.out.println("greenbill  is [" + getMap(CO,"stamp.mapping.pluralTable").getClass()+ "]");
		//ConfigurationHolder.setConfig(CO);
		//Map confmap = ConfigurationHolder.getFlatConfig();  
	}

	public void visit(ASTNode[] astNodes, SourceUnit sourceUnit) {

		String createdByField = CONF.getProperty("stamp.audit.createdBy");
		String editedByField = CONF.getProperty("stamp.audit.editedBy");
		String editedDateField = CONF.getProperty("stamp.audit.editedDate");
		String createdDateField = CONF.getProperty("stamp.audit.createdDate");

		for (ASTNode astNode : astNodes) {
			if (astNode instanceof ClassNode) {
				ClassNode classNode = (ClassNode) astNode;
				//List<FieldNode>  fnlist = classNode.getFields();			
				//LOG.info("[Audit stamp ASTTransformation] Adding propertie [edited..created] to class [" + classNode.getName() + "]");
				//System.out.println(classNode.getName() + " - [Audit stamp ASTTransformation] Adding propertie [edited..created]");
				if(editedByField!=null){
					classNode.addProperty(editedByField, Modifier.PUBLIC, new ClassNode(Person.class), ConstantExpression.NULL,null,null);
					addNullableConstraint(classNode,editedByField);
                }
				if(createdByField!=null){
					classNode.addProperty(createdByField, Modifier.PUBLIC, new ClassNode(Person.class), ConstantExpression.NULL,null,null);
					addNullableConstraint(classNode,createdByField);
                }
				Expression now = new ConstructorCallExpression(new ClassNode(java.util.Date.class),MethodCallExpression.NO_ARGUMENTS);
				if(createdDateField!=null){
					classNode.addProperty(createdDateField, Modifier.PUBLIC, new ClassNode(java.util.Date.class), now, null, null);
					addNullableConstraint(classNode,createdDateField);
				}
				if(editedDateField!=null){
					classNode.addProperty(editedDateField, Modifier.PUBLIC, new ClassNode(java.util.Date.class), now, null, null);
					addNullableConstraint(classNode,editedDateField);
				}
                               
				classNode.addInterface(new ClassNode(DomainObject.class));
				/****comment this out if you don't want our the custom ID and table name stuff****/
			//	addTableAndIdMapping(classNode);


			}
		}
	}

	@SuppressWarnings("rawtypes")
	public void addTableAndIdMapping(ClassNode classNode){
		FieldNode closure = classNode.getDeclaredField("mapping");

		if(closure!=null){
			boolean hasTable=hasFieldInClosure(closure,"table");
			boolean hasId=hasFieldInClosure(closure,"id");

			ClosureExpression exp = (ClosureExpression)closure.getInitialExpression();
			BlockStatement block = (BlockStatement) exp.getCode();

			//this just adds an s to the class name for the table if its not specified 
			Boolean pluralize = (Boolean)getMap(CO,"stamp.mapping.pluralTable");
			if(!hasTable && pluralize!=null && pluralize){
				String tablename = GrailsNameUtils.getShortName(classNode.getName())+"s";
				//LOG.info("Added new mapping to assign table: " + tablename);
				MethodCallExpression tableMeth = new MethodCallExpression(
					VariableExpression.THIS_EXPRESSION,
					new ConstantExpression("table"),
					new ArgumentListExpression(new ConstantExpression(tablename)) 
					);
				//block = (BlockStatement) exp.getCode();
				block.addStatement(new ExpressionStatement(tableMeth));
				//System.out.println(classNode.getName()+" - Added table mapping " + tablename );
			}
			//This adds the ID generator that we use for domian classes
			Map tableconf = (Map)getMap(CO,"stamp.mapping.id");
			if(!hasId && tableconf!=null){
				NamedArgumentListExpression namedarg = new NamedArgumentListExpression();
				if(tableconf.get("column") != null){
					namedarg.addMapEntryExpression(new ConstantExpression("column"), new ConstantExpression(tableconf.get("column").toString()));
				}
				if(tableconf.get("generator") != null){
					namedarg.addMapEntryExpression(new ConstantExpression("generator"), new ConstantExpression(tableconf.get("generator").toString()));
				}
				MethodCallExpression tableMeth = new MethodCallExpression(
					VariableExpression.THIS_EXPRESSION,
					new ConstantExpression("id"),
					namedarg
					);
				//block = (BlockStatement) exp.getCode();
				block.addStatement(new ExpressionStatement(tableMeth));
				//System.out.println(classNode.getName() + " - Added ID mapping with "+ tableconf);
			}
		}
		//System.out.println(block.toString());
	}

	public void addNullableConstraint(ClassNode classNode,String fieldName){
		FieldNode closure = classNode.getDeclaredField("constraints");

		if(closure!=null){

			ClosureExpression exp = (ClosureExpression)closure.getInitialExpression();
			BlockStatement block = (BlockStatement) exp.getCode();

			if(!hasFieldInClosure(closure,fieldName)){
				NamedArgumentListExpression namedarg = new NamedArgumentListExpression();
				namedarg.addMapEntryExpression(new ConstantExpression("nullable"), new ConstantExpression(true));
				MethodCallExpression constExpr = new MethodCallExpression(
					VariableExpression.THIS_EXPRESSION,
					new ConstantExpression(fieldName),
					namedarg
					);
				block.addStatement(new ExpressionStatement(constExpr));
				//System.out.println(classNode.getName() + " - Added nullabel constraint for "+ fieldName);
			}
		}
		//System.out.println(block.toString());
	}



	public boolean hasFieldInClosure(FieldNode closure, String fieldName){
		if(closure != null){
			ClosureExpression exp = (ClosureExpression) closure.getInitialExpression();
			BlockStatement block = (BlockStatement) exp.getCode();
			List<Statement> ments = block.getStatements();
			for(Statement expstat : ments){
				if(expstat instanceof ExpressionStatement && ((ExpressionStatement)expstat).getExpression() instanceof MethodCallExpression){
					MethodCallExpression methexp = (MethodCallExpression)((ExpressionStatement)expstat).getExpression();
					ConstantExpression conexp = (ConstantExpression)methexp.getMethod();
					if(conexp.getValue().equals(fieldName)){
						return true;
					}
				}
			}
		}
		return false;
	}


	static public String getContents(File aFile) {
		//...checks on aFile are elided
		StringBuilder contents = new StringBuilder();

		try {
			//use buffering, reading one line at a time
			//FileReader always assumes default encoding is OK!
			BufferedReader input =  new BufferedReader(new FileReader(aFile));
			try {
				String line = null; 
				while (( line = input.readLine()) != null){
					contents.append(line);
					contents.append(System.getProperty("line.separator"));
				}
			}
			finally {
				input.close();
			}
		}
		catch (IOException ex){
			ex.printStackTrace();
		}

		return contents.toString();
	}

	@SuppressWarnings("rawtypes")
	static public Object getMap(Map configMap, String keypath) {
		String keys[] = keypath.split("\\.");
		Map map = configMap;
		for(String key : keys){
			Object val = map.get(key);
			if(val !=null){
				//System.out.println("got a key for are " +key);
				if(val instanceof Map){
					map = (Map)map.get(key);
				} else{
					return val;
				}
			}else{
				return null;
			}
		}
		return map;	
	}


}


//FUTURE 
/**
java.math.BigDecimal
java.lang.Integer
java.lang.Long
java.util.Date
java.lang.String
java.lang.Boolean
*/

/**
since grails has everything default to nullable:false, we change that to nullable:true here since omost of the time we condider it ok
explicity set nullable:false as the exception

public void addConstraintDefaults(ClassNode classNode){
	List<FieldNode>  fnlist = classNode.getFields();
	for(FieldNode fnode : fnlist){
		if(!fnode.isStatic()){
			//check if the type is in our list
			System.out.println("*" + fnode.getName() + " - " + fnode.getType().getName());
		}
	}
	
	boolean hasConstraint=false;

}
**/

/*
org.codehaus.groovy.ast.stmt.BlockStatement@f4b2da[
	org.codehaus.groovy.ast.stmt.ExpressionStatement@a0a4a[
		expression:org.codehaus.groovy.ast.expr.MethodCallExpression@29aa5a[
			object: org.codehaus.groovy.ast.expr.VariableExpression@6f0383[variable: this] 
			method: ConstantExpression[discDate] 
			arguments: org.codehaus.groovy.ast.expr.NamedArgumentListExpression@4fb195[
				org.codehaus.groovy.ast.expr.MapEntryExpression@13becc(key: ConstantExpression[nullable], value: ConstantExpression[true])
			]
		]
	],.....

/*
{ org.codehaus.groovy.ast.stmt.BlockStatement@f0bc0[
	org.codehaus.groovy.ast.stmt.ExpressionStatement@cc9e15[
		expression:org.codehaus.groovy.ast.expr.MethodCallExpression@9e94e8[
			object: org.codehaus.groovy.ast.expr.VariableExpression@3c2282[variable: this] 
			method: ConstantExpression[table] 
			arguments: org.codehaus.groovy.ast.expr.ArgumentListExpression@42428a[ConstantExpression[SyncSteps]]
		]
	], 
	org.codehaus.groovy.ast.stmt.ExpressionStatement@1eafb4[
		expression:org.codehaus.groovy.ast.expr.MethodCallExpression@a17663[
			object: org.codehaus.groovy.ast.expr.VariableExpression@3c2282[variable: this] 
			method: ConstantExpression[id] 
			arguments: org.codehaus.groovy.ast.expr.NamedArgumentListExpression@636202[
				org.codehaus.groovy.ast.expr.MapEntryExpression@b781ea(
					key: ConstantExpression[column], value: ConstantExpression[OID]
				), 
				org.codehaus.groovy.ast.expr.MapEntryExpression@b25934(
					key: ConstantExpression[generator], value: ConstantExpression[ozone.owf.nineci.hibernate.NewObjectIdGenerator]
				)
			]
		]
	], org.codehaus.groovy.ast.stmt.ExpressionStatement@fe6f06[
		expression:org.codehaus.groovy.ast.expr.MethodCallExpression@2b0459[
			object: org.codehaus.groovy.ast.expr.VariableExpression@3c2282[variable: this] 
			method: ConstantExpression[syncBatch] 
			arguments: org.codehaus.groovy.ast.expr.NamedArgumentListExpression@2a938f[
				org.codehaus.groovy.ast.expr.MapEntryExpression@3dbf04(key: ConstantExpression[column], value: ConstantExpression[SyncBatchId])]]]] }


*/
