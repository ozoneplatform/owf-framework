package ozone.owf.grails.services.model

class PreferenceServiceModel extends AbstractServiceModel {
  Long id
  String namespace
  String path
  String value
  PersonServiceModel user

  Map toDataMap() {
    return [
			id: id,
            namespace: namespace,
            path: path,
            value: value,
            user: [userId: user?.username]
    ]
  }
}
