
import ozone.owf.DashboardFactory;
import ozone.owf.dashboard.Dashboard;
import groovy.json.JsonSlurper;
import groovy.sql.Sql;


String.metaClass.toCamelCase = {->
	return delegate.replaceAll( "(_)([A-Za-z0-9])", { Object[] it -> it[2].toUpperCase() } )
}

BufferedReader br = new BufferedReader(new InputStreamReader(System.in))
print  'Enter database url of the form jdbc:subprotocol:subname : '
def url = br.readLine()

print  'Enter fully qualified class name of the driver class: '
def driver = br.readLine()

print  'Enter username: '
def username = br.readLine()

print  'Enter password: '
def password = System.console().readPassword()

def sql = Sql.newInstance(
	driver: driver,
	url: url,
	user: username,
	password: String.valueOf(password)
);

def dashboardsMap = sql.rows('SELECT * FROM dashboard_backup');
def dashboards = [];
def failedDashboards = [];

dashboardsMap.each() {
	def widgetsMap = sql.rows('SELECT region, button_opened, z_index, minimized, unique_id, height, pinned, name, widget_guid, column_pos, width, button_id, collapsed, maximized, state_position, active, y, x FROM dashboard_widget_state_backup where dashboard_widget_state_backup.dashboard_id = ' + it.id);
	def widgets = [];
	def layoutConfigMap = sql.firstRow('SELECT layout_config FROM dashboard where dashboard.id = ' + it.id);
	def layoutConfig = layoutConfigMap.layout_config;
	
	widgetsMap.each() { widget ->
		widgets << widget ;
	}
	def dashboard = DashboardFactory.create(it, widgets);
	dashboards.add(dashboard);
	
	if(layoutConfig && !(layoutConfig instanceof String)) {
		// layoutConfig instanceof oracle.sql.CLOB || layoutConfig instanceof net.sourceforge.jtds.jdbc.ClobImpl
		if ( (int) layoutConfig.length() > 0) {
			layoutConfig = layoutConfig.getSubString(1, (int) layoutConfig.length());
		}
	}
	
	dashboard.layoutConfig = layoutConfig;
	
	dashboard.validate();
	
	if(dashboard.errors.size() == 0) {
		// println "Dashboard '${dashboard.name}' is valid";
	}
	else {
		failedDashboards << dashboard;
		
		println "Dashboard failed validation: \nid: ${dashboard.id}, name: ${dashboard.name}";
		dashboard.errors.each() {
			println it;
		}
		println ''
	}
};

if(failedDashboards.size() > 0) {
	println '------------------------------------------------------------------------------'
	println '------------------------------------------------------------------------------'
	println "Total no dashboards that failed validation: ${failedDashboards.size()}";
}
else {
	println "\nDashboards validated. No Errors found!"
}


























