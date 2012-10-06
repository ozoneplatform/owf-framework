using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Services; 
namespace dotnet_widget
{
    /// <summary>
    /// Summary description for ChannelService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class ChannelService : System.Web.Services.WebService
    {
        public static List<ChannelMessage> allMessages =
            new List<ChannelMessage>(); 

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string ChannelListener(string sender, string data)
        {
            allMessages.Add(new ChannelMessage(sender, data)); 

            return sender + " " + data;     
        }
    }

    public class ChannelMessage
    {
        string source;

        public string Source
        {
            get { return source; }
            set { source = value; }
        }
        string timestamp;

        public string Timestamp
        {
            get { return timestamp; }
            set { timestamp = value; }
        }
        string data;

        public string Data
        {
            get { return data; }
            set { data = value; }
        }

        public ChannelMessage(string source, string data)
        {
            this.data = data;
            this.source = source;
            this.timestamp = DateTime.Now.ToString(); 
        }
    }
}
