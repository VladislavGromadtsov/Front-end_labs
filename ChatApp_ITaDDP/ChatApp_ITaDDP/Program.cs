using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp_ITaDDP
{
    class Program
    {
        const string HOST = "127.0.0.1";
        static Client _client;
        static EndPoint remotePoint;
        static Socket listeningSocket;
        static int msgCounter = 0;
        static List<Message> messagesList;
        static bool successfulDelivery;
        
        
        static void Main(string[] args)
        {
            Program program = new Program();
            _client = program.joinClient();
            messagesList = new List<Message>();

            try
            {
                listeningSocket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
                listeningSocket.Bind(new IPEndPoint(IPAddress.Parse(_client.IPAddress), _client.localPort));

                remotePoint = new IPEndPoint(IPAddress.Parse(_client.IPAddress), _client.remotePort);

                Task listeningTask = new Task(Listen);
                listeningTask.Start();

                while (true) 
                {
                    string msg = Console.ReadLine();
                    var message = new Message(msg, msgCounter, _client.userName, MsgType.Data);

                    byte[] data = Encoding.Unicode.GetBytes(message.ToString());
                    messagesList.Add(message);
                    msgCounter++;
                    listeningSocket.SendTo(data, remotePoint);

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        public Client joinClient()
        {
            Console.Write("Enter your local port: ");
            var localPort = Int32.Parse(Console.ReadLine());

            Console.Write("Enter your remote port: ");
            var remotePort = Int32.Parse(Console.ReadLine());

            Console.Write("Enter your nickname: ");
            var nickName = Console.ReadLine();

            return new Client(localPort, remotePort, HOST, nickName);
        }

        public static void Listen() 
        {
            try
            {
                while (true) 
                {
                    StringBuilder builder = new StringBuilder();
                    int bytes = 0;
                    byte[] data = new byte[256];
                    EndPoint remoteIp = new IPEndPoint(IPAddress.Any, _client.remotePort);

                    do
                    {
                        bytes = listeningSocket.ReceiveFrom(data, ref remoteIp);
                        builder.Append(Encoding.Unicode.GetString(data, 0, bytes));
                    }
                    while (listeningSocket.Available > 0);

                    IPEndPoint remoteFullIp = remoteIp as IPEndPoint;
                    Message message = new Message(builder.ToString());
                    messagesList.Add(message);
                    Console.WriteLine(message.ToString());
                    msgCounter++;

                    if (message.type == MsgType.Data)
                    {
                        messagesList.Add(message);
                        Console.WriteLine(message.ToString());
                        msgCounter++;
                    }
                    else 
                    {
                        Console.WriteLine(message.ToString());
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }
}
