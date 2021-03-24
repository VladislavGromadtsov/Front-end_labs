using System;
using System.Collections.Generic;
using System.Text;

namespace ChatApp_ITaDDP
{
    class Client
    {
        public int localPort { get; set; }
        public int remotePort { get; set; }
        public string IPAddress { get; set; }
        public string userName { get; set; }

        public Client(int localPort, int remotePort, string iPAddress, string clientsName)
        {
            this.localPort = localPort;
            this.remotePort = remotePort;
            IPAddress = iPAddress;
            this.userName = clientsName;
        }
    }
}
