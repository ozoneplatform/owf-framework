/**
 * Package for custom access classes
 */
package custom.access;

import java.util.ArrayList;

import custom.access.AccessLevel;

/**
 * This is a very simple example class that checks widget access levels. 
 * It is intended to be overridden. Implementation below expects the access level 
 * to be an integer between 1 and 6.
 * 
 * @author 
 *
 */
public class CustomAccessChecker {
	/**
	 * Default constructor
	 */
	public CustomAccessChecker() {}

	/**
	 * Check whether the specified username (which can be a user or a url)
	 * has access to the specified access level.
	 */
    public boolean checkAccess(String username, ArrayList<AccessLevel> formalAccesses) {
		ArrayList<AccessLevel> receivingWidgetFormalAccesses = getFormalAccesses(username);
		
		for (int i = 0; i < formalAccesses.size(); i++) {
			AccessLevel accessLevel = formalAccesses.get(i);
			if (accessLevel.getAccessLevel() > receivingWidgetFormalAccesses.get(0).getAccessLevel()) {
				return false;
			}
		}
		
        return true;
    }
    
    public ArrayList<AccessLevel> getFormalAccesses(String username) {
    	ArrayList<AccessLevel> formalAccesses = new ArrayList<AccessLevel>();
    	AccessLevel accessLevel = new AccessLevel("4");
    	formalAccesses.add(accessLevel);
    	return formalAccesses;
    }
}
