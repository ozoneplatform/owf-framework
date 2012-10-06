Ext.ns('Ext.ux.form'); 

/**
 * A form field that automatically generates mathematical challenge question to subvert Robot / Spam abuse.<br><br>
 * <b>Notes:</b><ul>
 * <li>A configurable mathematical equation is used to validate the field.</li>
 * <li>The equation may be of varying form and/or complexity.</li>
 * <li>Randomly generated equations for specified operation types (addition,
 *   multiplation, subtraction) and configurable solution presentation
 *   (linear form of 5+3=?, reverse form of 5+?=8, or either of these randomly
 *   chosen).</li>
 * <li>The validation message (equation) will display as the validation error.</li>
 * </ul>
 * <br>Demo link: <a href="http://extjs-ux.org/repo/authors/mjlecomte/trunk/Ext/ux/form/examples/registration.html">here</a>
 * <br>Forum thread: <a href="http://extjs.com/forum/showthread.php?p=195962">here</a>
 * <p>
 * Usage:
 * <pre><code>var sample = new Ext.FormPanel({
    labelWidth: 80,  
    url:'registration.php',
    frame:true,
    title: 'Sample Form',
    bodyStyle:'padding:5px 5px 0',
    width: 350,
    defaults: {width: 230},
    defaultType: 'textfield',
    items: [{
            fieldLabel: 'First Name',
            name: 'first'
        },{
            fieldLabel: 'Last Name',
            name: 'last'
        },{
            fieldLabel: 'Are you human?',
            name: 'human',
            xtype: 'botfield'
            //optionally override a qtip that will be displayed (depends on
            //an Ext.form.Field being installed
            //qtip:{
                //text:'To verify you are not a robot, please enter the value that satisfies this equation:',
                //width: 220
            //}
        }],
    buttons: [{
        text: 'Save'
    },{
        text: 'Cancel'
    }]
});</code></pre>
 * @class Ext.ux.form.BotField
 * @extends Ext.form.TextField
 * @author Michael LeComte (<a href="http://extjs.com/forum/member.php?u=6834">mjlecomte</a>)
 * @license <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0</a>
 * @version 0.06 - Sep 28, 2008 
 * @ version 0.05 - Sep  4, 2008 
 * @ version 0.04 - Aug 29, 2008 
 * @ version 0.03 - Aug  2, 2008 
 * @ version 0.02 - Jul 15, 2008 
 * @ version 0.01 - Jul 15, 2008 
 * @donate <form action="https://www.paypal.com/cgi-bin/webscr" method="post">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="image" src="https://www.paypal.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="Make a donation to support ongoing development">
<img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1">
<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
">
</form>
 */
Ext.ux.form.BotField = Ext.extend(Ext.form.NumberField,  {
    //reconfigurables
    /**
     * @cfg {Boolean} allowNegative False to prevent entering a negative sign (defaults to true)
     */
    allowNegative : true,
    /**
     * @cfg {String} answerText Text to indicate where the answer should be (defaults to "?")
     */
    answerText : "?",
    /**
     * @cfg {String} answerLocation Location the answer may be positioned relative to the "="
     * sign, options are "after", "before", or "either" (defaults to "either").
     */
    answerLocation : "either",
    
    /**
     * @cfg {Array} answerOperators Specify which mathematical operators may be used for the
     * generated equation.  Since division operator "/" may result in decimal answers, division
     * is not allowed.  By default add, subtract, and multiply operators will be used randomly
     * to generate the equation:
     * <pre><code>answerOperators : ["+","-","*"]</code></pre>
     */
    answerOperators : ["+","-","*"],

    /**
     * @cfg {String} errorText The prefix text to display before the equation in the validation
     * error message. (defaults to "Enter the <b>number</b> which satisfies the equation: <br/>")
     */
    errorText : "Enter the <b>number</b> which satisfies the equation: <br/>",
    /**
     * @cfg {Boolean} hideQuestion True to delete contents of textfield if the value is still
     * equal to the validation question (defaults to true).
     */
    hideQuestion: true,
    /**
     * @cfg {String} messageText Text to display as part of qtip (defaults to 
     * "To verify you are not a robot, please enter the <b>number</b> that satisfies this equation:<br />")
     */
    messageText : 'To verify you are not a robot, please enter the <b>number</b> that satisfies this equation:<br />',
    /**
     * @cfg {Boolean} showQuestion True to display the validation question initially the field
     * value (defaults to true)
     */
    showQuestion : true,
    /**
     * @cfg {Boolean} selectOnFocus True to automatically select any existing field text when the
     * field receives input focus (defaults to true)
     */
    selectOnFocus : true,

    //end reconfigurables

    /*
     * extend onRender in order to apply the tooltip message
     */
	/** @private */
    onRender : function(){

        //set the random equation and result to thwart bots
        this.setBotValue();

        if(!this.qtip){
            this.qtip = {};
        }
           
        //designed to work with an Ext.form.Field override which will display qtips
        if (this.qtip) {
            this.qtip.text = this.qtip.text || this.messageText + '<b>' + this.botMessage + '</b>';
            this.qtip.width = this.qtip.width || 220;
        }

        //show the question in the field (if specified via config)
        if (this.showQuestion) {
            //this.el.dom.value = this.botMessage;
            //this.emptyText = this.botValMessage; 
            this.emptyText = this.botMessage; 
        }

        //call parent
        Ext.ux.form.BotField.superclass.onRender.apply(this, arguments);
        
    }, // end onRender

	/** @private */
    initEvents : function(){

        Ext.apply(this, {
            /**
             * (Boolean} allowDecimals False to disallow decimal values (defaults to true)
             */
            allowDecimals : false,
            allowBlank: false
        });

        //call parent
        Ext.ux.form.BotField.superclass.initEvents.apply(this, arguments);

        this.validator = this.validateBotValue;
        
    }, // end of initEvents
 
    /**
     * {Function} validateBotValue The custom validation function that is called
     * during field validation. This function is called only after the basic ext 
     * validators all return true. This function is passed the current field 
     * value will return boolean true if the value is valid or a string error 
     * message if invalid.
     */
	/** @private */
    validateBotValue : function(v){

        if (v != this.botAnswer){
            return this.errorText + this.botValMessage;
        }
        
        return true;
    }, // end validateBotValue
    
    /**
     * {Function} setBotValue Sets the random equation and corresponding solution.
     */
	/** @private */
    setBotValue : function(){

        //generate two random numbers        
        var a = Math.ceil(Math.random() * 10);
        var b = Math.ceil(Math.random() * 10);       

        //determine which operator to use
        //random number between 0 and length of array
        var max = this.answerOperators.length - 1;
        var min = 0;
        var i = Math.floor((max-(min-1))*Math.random()) + min;
        var operator = this.answerOperators[i];

        //some shuffling if don't want negative
        if ((operator == '-') && !this.allowNegative){
            var hi = Math.max(a,b);
            b = Math.min(a,b);
            a = hi;                        
        }

        //determine how to compose equation
        var equation = a + operator + b;

        //determine and set solution
        this.botAnswer = eval(equation);

        if (this.answerLocation == 'either') {
            this.answerLocation = (a < b) ? 'before' : 'after';
        }        
        var beforeEqual, afterEqual;
        if (this.answerLocation == 'after') {
            beforeEqual = b;
            afterEqual = this.answerText;
        }        
        else {
            beforeEqual = this.answerText;
            afterEqual = this.botAnswer;
            this.botAnswer = b;
        }        

        //Set the message to display initial question and validation failure messages.
        this.botMessage = String.format('{0} {1} {2} = {3}', a, operator, beforeEqual, afterEqual);
        this.botValMessage = '<b>'+this.botMessage+'</b>';
        
    } // end setBotValue

});

//register xtype
Ext.reg('botfield', Ext.ux.form.BotField);