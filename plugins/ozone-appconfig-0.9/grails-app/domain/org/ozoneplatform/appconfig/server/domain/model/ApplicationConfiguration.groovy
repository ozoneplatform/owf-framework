package org.ozoneplatform.appconfig.server.domain.model

class ApplicationConfiguration {

	Long id;
	
	//Can this instance be edited?
	Boolean mutable = Boolean.TRUE;
	
	//A code that represents the configuration item key
	String code;

	//The string representation of the configuration item
	String value;

	//Short title
	String title;

	//A description for the configuration item
	String description;

	//The type of the value (boolean, string, int, etc)
	String type;
	
	//The group the configuration item belongs to (Theme, ScoreCard, Franchise, Marketplace, etc)
	String groupName;

	//Some groups belong to a secondary group
	String subGroupName;
	
	//This will specify the order that a config will show
	Integer subGroupOrder = 0;
	
	String help;
	
	Long version = 0;
	
    static constraints = {
		code(nullable:false, length:255)
		value(nullable:true, length:2000)
		title(nullable:false, length:255)
		description(nullable:true, length:2000)
		type(nullable:false, length:255)
		groupName(nullable:false, length:255)
		subGroupName(nullable:true, length:255)
		subGroupOrder(nullable:true)
		help(nullable:true, length:2000)
    }
	static mapping = {
		cache true
		groupName index: 'app_config_group_name_idx'
	}
	
	
	def valueAsList(){
		def valAsArray = this.value.split(",")
		valAsArray
	}
	
	def valueAsMap(def parseToken = '::'){
		def map = [:]
		this.value.split(",").each {param ->
			def nameAndValue = param.split(parseToken)
			
			if(nameAndValue.length > 1)
				map[nameAndValue[0].trim()] = nameAndValue[1].trim()
		}
		map
	}

	def asMap() {
		return [
			id: id,
			code: code,
			value: value,
			title: title,
			mutable: mutable,
			description: description,
			type: type,
			groupName: groupName,
			subGroupName: subGroupName,
			subGroupOrder: subGroupOrder,
			help: help
		]
	}
	
	public static ApplicationConfiguration buildStringInstance(ApplicationSetting setting, ApplicationSettingType settingType){
		 this.build(setting, settingType, "String")
	}

	public static ApplicationConfiguration buildIntegerInstance(ApplicationSetting setting, ApplicationSettingType settingType){
		this.build(setting, settingType, "Integer")
	}

	public static ApplicationConfiguration buildDecimalInstance(ApplicationSetting setting, ApplicationSettingType settingType){
		this.build(setting, settingType, "Decimal")
	}

	public static ApplicationConfiguration buildBooleanInstance(ApplicationSetting setting, ApplicationSettingType settingType){
		ApplicationConfiguration config = this.build(setting, settingType, "Boolean")
		config.value = "false"
		config
	}

	public static ApplicationConfiguration buildImageInstance(ApplicationSetting setting, ApplicationSettingType settingType){
		this.build(setting, settingType, "Image")
	}

	public static ApplicationConfiguration buildListInstance(ApplicationSetting setting, ApplicationSettingType settingType){
		this.build(setting, settingType, "List")
	}

	public static ApplicationConfiguration buildMapInstance(ApplicationSetting setting, ApplicationSettingType settingType){
		this.build(setting, settingType, "Map")
	}
					
	private static ApplicationConfiguration build(ApplicationSetting setting, ApplicationSettingType settingType, String configType){
		ApplicationConfiguration applicationConfiguration = new ApplicationConfiguration()
		applicationConfiguration.with {
			code 			= setting.getCode()
			groupName 		= settingType.getDescription()
			subGroupOrder	= 0
			mutable 		= true
			type    		= configType
		}
		applicationConfiguration
	}
	
}
