using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
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
        static bool successfulDelivery = false;
        const int MAX_ATTEMPTS = 10;
        static Task listeningTask;


        static void Main(string[] args)
        {
            Program program = new Program();
            _client = program.joinClient();
            messagesList = new List<Message>();
            listeningSocket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
            listeningSocket.Bind(new IPEndPoint(IPAddress.Parse(_client.IPAddress), _client.localPort));

            remotePoint = new IPEndPoint(IPAddress.Parse(_client.IPAddress), _client.remotePort);
            try
            {

                listeningTask = new Task(Listen);
                listeningTask.Start();

                while (true) 
                {
                    SendMessage();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        public static void SendMessage() 
        {
            string msg = Console.ReadLine();
            if (msg == "-h")
            {
                messagesList.Sort();
                foreach (var mes in messagesList)
                {
                    Console.WriteLine(mes.id + "/" + mes.authorNickname + "/" + mes.text);
                }
            }
            else 
            {
                var message = new Message(msg, msgCounter, _client.userName, MsgType.Data);

                byte[] data = Encoding.Unicode.GetBytes(message.ToString());
                messagesList.Add(message);
                msgCounter++;
                listeningSocket.SendTo(data, remotePoint);

                int att_counter = 1;
                while (att_counter <= MAX_ATTEMPTS)
                {
                    Thread.Sleep(1000);
                    if (successfulDelivery == false)
                    {
                        Console.WriteLine("Message delivery error. Message not delivered");
                        if (att_counter == MAX_ATTEMPTS)
                        {
                            Console.WriteLine("The number of attempts has been exhausted.");
                            Exit();
                            break;
                        }

                        listeningSocket.SendTo(data, remotePoint);
                        att_counter++;
                    }
                    else
                    {
                        successfulDelivery = false;
                        break;
                    }
                }
            }
            
        }
        private static void Exit()
        {
            throw new NotImplementedException();
        }

        public Client joinClient()
        {
            Console.Write("Enter your local port: ");
            var localPort = Int32.Parse(Console.ReadLine());

            Console.Write("Enter your remote port: ");
            var remotePort = Int32.Parse(Console.ReadLine());

            Console.Write("Enter your nickname: ");
            var nickName = Console.ReadLine();

            Console.WriteLine("To view chat history press -h");
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

                    if (message.type == MsgType.Data)
                    {
                        var _remotePoint = new IPEndPoint(IPAddress.Parse(_client.IPAddress), _client.remotePort);
                        var _response = new Message(" ", 100, " ", MsgType.Response);
                        listeningSocket.SendTo(Encoding.Unicode.GetBytes(_response.ToString()), _remotePoint);

                        messagesList.Add(message);
                        Console.WriteLine(message.ToString());
                        msgCounter++;
                    }
                    else if(message.type == MsgType.Response)
                    {
                        Console.WriteLine("Message delivered");
                        successfulDelivery = true;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                listeningTask = new Task(Listen);
                listeningTask.Start();
            }
        }
    }
}
