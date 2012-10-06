using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;
using System.Windows.Controls.DataVisualization.Charting;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Windows.Browser;

namespace OWFSilverlightDemo
{
    public partial class Page : UserControl
    {

        private string ChartType = "pie";

        public Page()
        {
            InitializeComponent();

            ChannelMenu.MenuItemClicked += new SilverlightContrib.Controls.MenuIndexChangedHandler(ChannelMenu_MenuItemClicked);

            HtmlPage.RegisterScriptableObject("Page", this);        
               
            PieSeries cs = ChannelChartsPie.Series[0] as PieSeries;
            cs.ItemsSource = ChannelTracking.trackingItems;

            BarSeries bs = ChannelChartsBar.Series[0] as BarSeries;
            bs.ItemsSource = ChannelTracking.trackingItems;

            ChannelGrid.ItemsSource = ChannelMessage.messageItems;
        }

        void ChannelMenu_MenuItemClicked(object sender, SilverlightContrib.Controls.SelectedMenuItemArgs e)
        {

            ChannelGrid.Visibility = Visibility.Collapsed;
            ChannelChartsPie.Visibility = Visibility.Collapsed;
            ChannelChartsBar.Visibility = Visibility.Collapsed;
            AddChanelStackPanel.Visibility = Visibility.Collapsed;
            ChannelShouterGrid.Visibility = Visibility.Collapsed;
            PrefsLayout.Visibility = Visibility.Collapsed;
            
            string s = e.Item.Name;

            if (s.Equals(menu_listener.Name))
            {
                AddChanelStackPanel.Visibility = Visibility.Visible;
                ChannelGrid.Visibility = Visibility.Visible;
            }
            else if (s.Equals(menu_stats.Name))
            {
                AddChanelStackPanel.Visibility = Visibility.Visible;
               if (ChartType.Equals("pie"))
                {
                    ChannelChartsPie.Visibility = Visibility.Visible;
                    ChannelChartsPie.Series[0].Visibility = Visibility.Visible;
                }
                else if (ChartType.Equals("bar"))
                {
                    ChannelChartsBar.Visibility = Visibility.Visible;
                    ChannelChartsBar.Series[0].Visibility = Visibility.Visible;
                }
            }
            else if (s.Equals(menu_shouter.Name))
            {
                ChannelShouterGrid.Visibility = Visibility.Visible;
            }
            else if (s.Equals(menu_prefs.Name))
            {
                PrefsLayout.Visibility = Visibility.Visible;
            }
        }

        [ScriptableMember]
        public void UpdateChannelChart(string channel, string message)
        {
            ChannelTracking t = ChannelTracking.GetTrackingItem(channel);
            t.Value++;
            ChannelMessage.AddTrackingItem(new ChannelMessage(channel, DateTime.Now, message));
        }

        private void FooButton_Click(object sender, RoutedEventArgs e)
        {
            string s = TextChannelName.Text;
            ChannelTracking.AddTrackingItem(new ChannelTracking(TextChannelName.Text));
            HtmlPage.Window.Invoke("subscribe",TextChannelName.Text);
        }

        private void ShouterButton_Click(object sender, RoutedEventArgs e)
        {
            HtmlPage.Window.Invoke("shout", TextShoutChannelName.Text, TextShoutMessage.Text);
        }

        [ScriptableMember]
        public void SetChartingType(string ChartingType)
        {
            ChartType = ChartingType;
            RBPieChart.IsChecked = ChartingType.Equals("pie");
            RBBarChart.IsChecked = ChartingType.Equals("bar");
        }

        private void RBPieChart_Click(object sender, RoutedEventArgs e)
        {
            ChartType = "pie";
            HtmlPage.Window.Invoke("setChartVisualization","pie");
        }

        private void RBBarChart_Click(object sender, RoutedEventArgs e)
        {
            ChartType = "bar";
            HtmlPage.Window.Invoke("setChartVisualization","bar");
        }

    }

    public class ChannelMessage : INotifyPropertyChanged
    {
        public ChannelMessage(string channelName, DateTime time, string message)
        {
            this._ChannelName = channelName;
            this._Time = time;
            this._Message = message;
        }

        private string _ChannelName;
        public string ChannelName
        {
            get { return _ChannelName; }
            set
            {
                _ChannelName = value;
                NotifyPropertyChanged("ChannelName");
            }
        }


        private DateTime _Time;
        public DateTime Time
        {
            get { return _Time; }
            set
            {
                _Time = value;
                NotifyPropertyChanged("Time");
            }
        }

        private string _Message;
        public string Message
        {
            get { return _Message; }
            set
            {
                _Message = value;
                NotifyPropertyChanged("Message");
            }
        }
        
        // implement the required event for the interface
        public event PropertyChangedEventHandler PropertyChanged;

        public void NotifyPropertyChanged(string propertyName)
        {
            if (PropertyChanged != null)
            {
                PropertyChanged(this,
                    new PropertyChangedEventArgs(propertyName));
            }
        }

        public static ObservableCollection<ChannelMessage> messageItems = new ObservableCollection<ChannelMessage>();

        public static void AddTrackingItem(ChannelMessage tracking)
        {
            messageItems.Add(tracking);
        }

    }


    public class ChannelTracking : INotifyPropertyChanged
    {
        public ChannelTracking(string Name)
        {
            this.Name = Name;
            this.Value = 0;
        }

        private string _Name;
        public string Name
        {
             get { return _Name; }
             set
             {
                 _Name = value;
                 NotifyPropertyChanged("Name");
             }      
        }


        private double _Value;
        public double Value
        {
            get { return _Value; }
            set
            {
                _Value = value;
                NotifyPropertyChanged("Value");
            }
        }

        // implement the required event for the interface
        public event PropertyChangedEventHandler PropertyChanged;


        public void NotifyPropertyChanged(string propertyName)
        {
            if (PropertyChanged != null)
            {
                PropertyChanged(this,
                    new PropertyChangedEventArgs(propertyName));
            }
 
        }
        
        public static ObservableCollection<ChannelTracking> trackingItems = new ObservableCollection<ChannelTracking>();

        public static void AddTrackingItem (ChannelTracking tracking)
        {
            trackingItems.Add(tracking);
        }

        public static ChannelTracking GetTrackingItem(string Key)
        {
            foreach (ChannelTracking t in trackingItems)
            {
                if (t.Name.Equals(Key))
                    return t;
            }
            return null;
        }

    }

}
