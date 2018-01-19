package custom.access;

public class AccessLevel {
	private int accessLevel;

	public AccessLevel() {
		this.accessLevel = 0;
	}

	public AccessLevel(String accessLevel) {
		this.accessLevel = Integer.parseInt(accessLevel);
	}

	public int setAccessLevel(String accessLevel) {
		this.accessLevel = Integer.parseInt(accessLevel);
		return this.accessLevel;
	}

	public int getAccessLevel() {
		return this.accessLevel;
	}

}
