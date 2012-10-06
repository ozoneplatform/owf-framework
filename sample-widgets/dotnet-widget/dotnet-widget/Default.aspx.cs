using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Threading;

namespace dotnet_widget
{
    public partial class _Default : System.Web.UI.Page
    {
        
        protected void Page_Load(object sender, EventArgs e)
        {
            
            if (!IsPostBack)
            {
                Session["channels"] = new List<string>();                 
            }
            numberMessagesLabel.Text = "Number of Messages: " + 
                ChannelService.allMessages.Count; 
        }

        protected void addChannelButton_Click(object sender, EventArgs e)
        {
            List<string> list = (List<string>)Session["channels"];
            lock (list)
            {
                if (list.Contains(this.channelNameTextBox.Text))
                    return; 

                list.Add(this.channelNameTextBox.Text);

                if (list.Count == 1)
                {
                    subscribedChannelLabel.Text = "Subscribed Channels: " + list[0];
                }
                else
                {
                    subscribedChannelLabel.Text += ", " + channelNameTextBox.Text; 
                }
            }

 
        }

        protected void searchButton_Click(object sender, EventArgs e)
        {
            if (searchTextBox.Text == "")
            {
                GridView2.DataSource = ChannelService.allMessages;
                GridView2.DataBind();
            }
            else
            {
                List<ChannelMessage> messages = new List<ChannelMessage>();
                foreach (ChannelMessage m in ChannelService.allMessages)
                {
                    if (m.Data.ToLower().Contains(searchTextBox.Text.ToLower()))
                    {
                        messages.Add(m);
                    }
                }
                GridView2.DataSource = messages;
                GridView2.DataBind();
            }
        }

        protected void updateTimer_Tick(object sender, EventArgs e)
        {

        }
 
    }
}
