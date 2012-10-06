package com.google.gwt.sample.stockwatcher.client;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyPressEvent;
import com.google.gwt.event.dom.client.KeyPressHandler;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestBuilder;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.http.client.Response;
import com.google.gwt.i18n.client.DateTimeFormat;
import com.google.gwt.i18n.client.NumberFormat;
import com.google.gwt.user.client.Random;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.FlexTable;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.VerticalPanel;

public class StockWatcher implements EntryPoint {

	private static final int REFRESH_INTERVAL = 5000;

	private VerticalPanel mainPanel = new VerticalPanel();
	private FlexTable stocksFlexTable = new FlexTable();
	private HorizontalPanel addPanel = new HorizontalPanel();
	private TextBox newSymbolTextBox = new TextBox();
	private Button addStockButton = new Button("Add");
	private Label lastUpdatedLabel = new Label();
	private ArrayList<String> stocks = new ArrayList<String>();

	/**
	 * This is the entry point method.
	 */
	public void onModuleLoad() {

        //init js
        js_shoutInit();

		// Create table for stock data.
		stocksFlexTable.setText(0, 0, "Symbol");
		stocksFlexTable.setText(0, 1, "Price");
		stocksFlexTable.setText(0, 2, "Change");
		stocksFlexTable.setText(0, 3, "Remove");

		// Add styles to elements in the stock list table.
		stocksFlexTable.setCellPadding(6);
		stocksFlexTable.getRowFormatter().addStyleName(0, "watchListHeader");
		stocksFlexTable.addStyleName("watchList");
		stocksFlexTable.getCellFormatter().addStyleName(0, 1, "watchListNumericColumn");
		stocksFlexTable.getCellFormatter().addStyleName(0, 2, "watchListNumericColumn");
		stocksFlexTable.getCellFormatter().addStyleName(0, 3, "watchListRemoveColumn");

		// Assemble Add Stock panel.
		addPanel.add(newSymbolTextBox);
		addPanel.add(addStockButton);
		addPanel.addStyleName("addPanel");

		// Assemble Main panel.
		mainPanel.add(stocksFlexTable);
		mainPanel.add(addPanel);
		mainPanel.add(lastUpdatedLabel);

		// Associate the Main panel with the HTML host page.
		RootPanel.get("stockList").add(mainPanel);

		// Move cursor focus to the input box.
		newSymbolTextBox.setFocus(true);
		newSymbolTextBox.getElement().setId("symbolText");

		// Setup timer to refresh list automatically.
		Timer refreshTimer = new Timer() {
			@Override
			public void run() {
				refreshWatchList();
			}
		};
		refreshTimer.scheduleRepeating(REFRESH_INTERVAL);

		// Listen for mouse events on the Add button.
		addStockButton.addClickHandler(new ClickHandler() {
			public void onClick(ClickEvent event) {
				addStockFromTextBox(true);
			}
		});

		// Listen for keyboard events in the input box.
		newSymbolTextBox.addKeyPressHandler(new KeyPressHandler() {
			public void onKeyPress(KeyPressEvent event) {
				if (event.getCharCode() == KeyCodes.KEY_ENTER) {
					addStockFromTextBox(true);
				}
			}
		});

		loadSavedStocks();
	}

	/**
	  *  Grabs the current value from the text box and calls addStock.
	  *  Executed when the user clicks the addStockButton
  	  *  or presses enter in the newSymbolTextBox.
	  */
	private boolean addStockFromTextBox(boolean persist) {
	    final String symbol = newSymbolTextBox.getText().toUpperCase().trim();
	    newSymbolTextBox.setFocus(true);

	    // Stock code must be between 1 and 10 chars that are numbers, letters,
		// or dots.
		if (!symbol.matches("^[0-9a-zA-Z\\.]{1,10}$")) {
			Window.alert("'" + symbol + "' is not a valid symbol.");
			newSymbolTextBox.selectAll();
			return false;
		}

		newSymbolTextBox.setText("");

		return addStock(symbol, persist);
	}

	/**
	 * Add stock to FlexTable.
	 */
	public boolean addStock(String stockSymbol, boolean persist) {
	    final String symbol = stockSymbol;

	    // Don't add the stock if it's already in the table.
		if (stocks.contains(symbol)) {
		    return false;
		}

		// Add the stock to the table.
		int row = stocksFlexTable.getRowCount();

		stocks.add(symbol);

		stocksFlexTable.setText(row, 0, symbol);
		stocksFlexTable.getCellFormatter().addStyleName(row, 1, "watchListNumericColumn");
		stocksFlexTable.setWidget(row, 2, new Label());
		stocksFlexTable.getCellFormatter().addStyleName(row, 1, "watchListNumericColumn");
		stocksFlexTable.getCellFormatter().addStyleName(row, 2, "watchListNumericColumn");
		stocksFlexTable.getCellFormatter().addStyleName(row, 3, "watchListRemoveColumn");

		persist(persist);

		// Add a button to remove a stock from the table.
		Button removeStockButton = new Button("x");
		removeStockButton.addStyleDependentName("remove");
		removeStockButton.addClickHandler(new ClickHandler() {
			public void onClick(ClickEvent event) {
				int removedIndex = stocks.indexOf(symbol);
				stocks.remove(removedIndex);
				stocksFlexTable.removeRow(removedIndex + 1);
				publishEvent(symbol + " has been removed from the StockWatcher");
				persist(true);
			}
		});
		stocksFlexTable.setWidget(row, 3, removeStockButton);

		// Get the stock price.
		refreshWatchList();

		if (persist) publishEvent(symbol + " has been added to the StockWatcher.");

		return true;
	}

	/**
	 * Generate random stock prices.
	 */
	private void refreshWatchList() {
		final double MAX_PRICE = 100.0; // $100.00
		final double MAX_PRICE_CHANGE = 0.02; // +/- 2%

		StockPrice[] prices = new StockPrice[stocks.size()];
		for (int i = 0; i < stocks.size(); i++) {
			double price = Random.nextDouble() * MAX_PRICE;
			double change = price * MAX_PRICE_CHANGE * (Random.nextDouble() * 2.0 - 1.0);

			prices[i] = new StockPrice(stocks.get(i), price, change);
		}

		updateTable(prices);
	}

	/**
	 * Update the Price and Change fields all the rows in the stock table.
	 *
	 * @param prices
	 *            Stock data for all rows.
	 */
	private void updateTable(StockPrice[] prices) {
		for (int i = 0; i < prices.length; i++) {
			updateTable(prices[i]);
		}

		// Display timestamp showing last refresh.
		lastUpdatedLabel.setText("Last update : " + DateTimeFormat.getMediumDateTimeFormat().format(new Date()));
	}

	/**
	 * Update a single row in the stock table.
	 *
	 * @param price
	 *            Stock data for a single row.
	 */
	private void updateTable(StockPrice price) {
		// Make sure the stock is still in the stock table.
		if (!stocks.contains(price.getSymbol())) {
			return;
		}

		int row = stocks.indexOf(price.getSymbol()) + 1;

		// Format the data in the Price and Change fields.
		String priceText = NumberFormat.getFormat("#,##0.00").format(price.getPrice());
		NumberFormat changeFormat = NumberFormat.getFormat("+#,##0.00;-#,##0.00");
		String changeText = changeFormat.format(price.getChange());
		String changePercentText = changeFormat.format(price.getChangePercent());

		// Populate the Price and Change fields with new data.
		stocksFlexTable.setText(row, 1, priceText);
		Label changeWidget = (Label) stocksFlexTable.getWidget(row, 2);
		changeWidget.setText(changeText + " (" + changePercentText + "%)");

		// Change the color of text in the Change field based on its value.
		String changeStyleName = "noChange";
		if (price.getChangePercent() < -0.1f) {
			changeStyleName = "negativeChange";
		} else if (price.getChangePercent() > 0.1f) {
			changeStyleName = "positiveChange";
		}

		changeWidget.setStyleName(changeStyleName);
	}

	private void publishEvent(String msg) {
		if (null != msg && msg.trim().length() > 0) {
			shout(msg);
		}
	}

	// A Java method using JSNI
	native void shout(String msg) /*-{
		$wnd.shout(msg); // $wnd is a JSNI synonym for 'window'
	}-*/;

	public void persist(boolean persist) {
		if (persist) {
		    StringBuffer sb = new StringBuffer("");
			if (null != stocks && !stocks.isEmpty()) {
				Iterator<String> itr = stocks.iterator();
				sb.append(itr.next());
				while (itr.hasNext()) {
					sb.append("," + itr.next());
				}
			}
			js_persist(sb.toString());
		}
	}

    native void js_shoutInit() /*-{
      $wnd.shoutInit();
    }-*/;

	native void js_persist(String arr) /*-{
		$wnd.persist(arr);
	}-*/;

	final native void fetchCallback(StockWatcher x, String result) /*-{
	    var symbols = [];
        if (result != null && result.value != null) {
          symbols = result.value.split(',');
        }
	    for (var i=0; i < symbols.length; i++) {
	        if (symbols[i].length > 0) { // In case there is a trailing ',' and we don't want to a blank stock
	            // call the addStock method defined in this class
    	        x.@com.google.gwt.sample.stockwatcher.client.StockWatcher::addStock(Ljava/lang/String;Z)(symbols[i], false);
	        }
	    }
	}-*/;

	// called from onModuleLoad, this method populates the grid with saved stocks
	final native void loadSavedStocks() /*-{
	    // set up onSuccess callback with GWT code.  Must pass in instance of current class.  See StockWatcher.html for how it is wired
	    $wnd.owf_gwt_example.onSuccess = this.@com.google.gwt.sample.stockwatcher.client.StockWatcher::fetchCallback(Lcom/google/gwt/sample/stockwatcher/client/StockWatcher;Ljava/lang/String;);
	    // call native fetch method defined in StockWatcher.html, uses the Ozone.pref.PrefServer.getUserPrefence method
        $wnd.owf_gwt_example.fetch(this);
	}-*/;

    // useful for firebug logging and debugging with GWT code
    // native void console_debug(Object obj) /*-{
    //     console.debug(obj);
    // }-*/;
    //
    // native void console_log(Object obj) /*-{
    //     console.log(obj);
    // }-*/;



}
