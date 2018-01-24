databaseChangeLog = {

  changeSet(author: "owf", id: "7.17.0-1", context: "sampleData, 7.17.0-sampleData") {
      comment(text="insert new sample data")
    insert(tableName: "person_role") {
        column(name: "role_id", valueNumeric: "26")
        column(name: "person_authorities_id", valueNumeric: "2")
    }
    insert(tableName: "person_role") {
        column(name: "role_id", valueNumeric: "26")
        column(name: "person_authorities_id", valueNumeric: "3")
    }
    insert(tableName: "person_role") {
        column(name: "role_id", valueNumeric: "26")
        column(name: "person_authorities_id", valueNumeric: "28")
    }
    insert(tableName: "person_role") {
        column(name: "role_id", valueNumeric: "27")
        column(name: "person_authorities_id", valueNumeric: "1")
    }
  }

}