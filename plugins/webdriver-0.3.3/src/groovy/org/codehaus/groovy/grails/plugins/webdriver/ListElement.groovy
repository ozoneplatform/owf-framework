package org.codehaus.groovy.grails.plugins.webdriver

import org.openqa.selenium.By
import org.openqa.selenium.WebElement

public class ListElement extends WebDriverPageElement {

    WebElement[] rows

    static elements = {
        rows(find:By.xpath("li"))
    }

    public int size() {
        return getRows().size()
    }

    public WebElement getRow(int row) {
        List rows = getRows()
        int size = rows.size()
        if (size == 0) {
            throw new IllegalArgumentException("The list has no rows")
        }
        if (row < 0 || row > size - 1) {
            throw new IllegalArgumentException("The list doesn't have row ${row}. Valid rows are 0..${size-1}")
        }
        return rows[row]
    }
}
