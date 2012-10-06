package org.codehaus.groovy.grails.plugins.webdriver

import org.openqa.selenium.By
import org.openqa.selenium.WebElement

public class TableElement<T> extends WebDriverPageElement {

    List<String> columnHeaders
    List<T> rows

    static elements = {
        columnHeaders(By.xpath("thead/tr/th"))
        rows(find: By.xpath("tbody/tr"), listElement: {config.tableRowElement ?: config.genericTypes?.get(0) ?: WebElement})
    }

    public int size() {
        return getRowCount()
    }

    public int getRowCount() {
        rows.size()
    }

    public T getAt(int row) {
        rows.get(row)
    }

    public WebElement getCell(int row, int col) {
        def cells = webElement.findElements(By.xpath("tbody/tr[${row + 1}]/td[${col + 1}]"))
        if (cells.size() == 1) {
            return cells[0]
        }
        int size = size()
        if (size == 0) {
            throw new IllegalArgumentException("The table has no rows")
        }
        if (row < 0 || row > size - 1) {
            throw new IllegalArgumentException("The table doesn't have row ${row}. Valid rows are 0..${size - 1}")
        }
        List columns = webElement.findElements(By.xpath("tbody/tr[${row + 1}]/td"))
        if (columns.size() == 0) {
            throw new IllegalArgumentException("Row ${row} has no columns")
        }
        if (col < 0 || col > columns.size() - 1) {
            throw new IllegalArgumentException("Row ${row} doesn't have column ${col}. Valid columns are 0..${columns.size() - 1}")
        }
        throw new IllegalArgumentException("Can't find a cell at ${row},${col} in the table")

    }

    public WebElement getLink(int row, int col) {
        getCell(row, col).findElement(By.tagName("a"))
    }

    public List getCells() {
        getRows().collect { WebElement row ->
            row.findElements(By.xpath("td"))
        }
    }

}
