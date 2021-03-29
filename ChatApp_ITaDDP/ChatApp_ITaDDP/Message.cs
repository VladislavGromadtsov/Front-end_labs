using System;
using System.Collections.Generic;
using System.Text;

namespace ChatApp_ITaDDP
{
    enum MsgType 
    {
        Data,
        Response,
        Connect,
        Connected,
        Disconnect,
        Disconnected,
        History,
    }

    class Message : IComparable<Message>
    {
        public string text { get; set; }
        public int id { get; set; }
        public string authorNickname { get; set; }
        public MsgType type { get; set; }
        const char separator = '/';

        public Message(string text, int id, string authorNickname, MsgType type)
        {
            this.text = text;
            this.id = id;
            this.authorNickname = authorNickname;
            this.type = type;
        }

        public Message(Message msg) 
        {
            this.id = msg.id;
            this.text = msg.text;
            this.authorNickname = msg.authorNickname;
            this.type = MsgType.History;
        }

        public override string ToString() 
        {
            return id.ToString() + separator + text + separator + authorNickname + separator + ((int)type).ToString();
        }

        public Message (string data) 
        {
            var msg = data.Split('/');
            this.id = Int32.Parse(msg[0]);
            this.text = msg[1];
            this.authorNickname = msg[2];
            this.type = (MsgType)Int32.Parse(msg[3]);
        }

        public int CompareTo(Message msg)
        {
            return this.id.CompareTo(msg.id);
        }
    }

}
