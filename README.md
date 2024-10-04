# BotsApp - Web Chat Application

![Image betrayed me 😒](img/logo.png)

**BotsApp** is a fully PHP-based web chat application designed for seamless individual and group communication. It allows users to send and receive messages in real-time, using a hybrid approach of polling and notifications. This project was created as part of a 5th semester academic requirement and showcases a simple, functional alternative to socket-based chat systems. 

Everyone was saying that you can't build a chat application without using Socket.IO or WebSockets along with a backend server, so I decided to take on the challenge and completed the project! 😊

I addressed many security issues along the way, though I’m aware there are still potential vulnerabilities. But you know what? I'm just focused on making sure it runs smoothly until my teachers give me full marks.

## Features

- **Individual and Group Chat:** Users can engage in both private and group conversations.
- **Message Notifications:** Notifications are sent to all participants in a group when someone sends a message.
- **Polling Mechanism:** Utilizes polling for retrieving new messages, ensuring updates are checked regularly without the need for continuous connections.
- **PHP Backend:** Fully built on PHP, without reliance on Socket.IO or other real-time communication frameworks.
- **MySQL Database:** Stores user information and chat logs securely using MySQL.
- **File and Image Sharing**
   - Users can share files and images within the chat, making communication more versatile and interactive.
- **Custom Emoji Uploads**
   - Users have the ability to upload their own emojis in three ways:
     - **Private:** Emojis are available only to the individual user who uploaded them.
     - **Public:** Emojis are available to all users across the platform.
     - **Group:** Emojis are available to users within a specific group.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript (AJAX)
- **Backend:** PHP
- **Database:** MySQL

## Installation

To set up and run BotsApp on your local machine, follow these steps:

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/darshitlimbad/BotsApp.git
    ```

2. **Set Up the Database:**
   - Create two new MySQL databases.
   - Import the provided `botsapp.sql` and `botsapp_statusdb.sql` file to set up the necessary tables.

3. **Configure the Project:**
   - Update the `functionality\db\env.php` file with your database credentials. (please provide your REcaptcha code 🤨)
   - Enable sodium extention if it is not enabled.

4. **Change the document root**
   - Go to your `http.conf` and change the document root to `botsapp` folder. 

5. **Start the Server:**
   - Run BotsApp on a local development server like XAMPP or WAMP for Windows, or LAMP for Linux.

6. **Access BotsApp:**
   - Open your browser and go to `http://localhost` to start using the application.

## Future Enhancements 
- Nahhh don't expect any new updates from me :).

## postReq Function and Progress Object:
- For postReq function and Progress Object checkout my postReq repo.
- [postReq repo](https://github.com/darshitlimbad/postReq/)


## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests for any improvements, bug fixes, or feature additions.

## `License`:

    BotsApp - Web Chat Application
    Copyright (C) 2024  Darshit Limbad

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

## `Contact`

For further information or support, please reach out at:
- **Email:** darshitlimbad+git@example.com
- **LinkedIn:**
https://www.linkedin.com/in/darshit-limbad/