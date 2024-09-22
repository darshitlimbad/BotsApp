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

- **Real-time Chat:** Moving from a polling-based system to a real-time WebSocket-based solution.
- **User Authentication:** Enhanced security features with password hashing (Using sodium) and secure login.
- **UI Improvements:** Improve the front-end design for a better user experience.
- **Mobile Optimization:** Make the chat app fully responsive and mobile-friendly.

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests for any improvements, bug fixes, or feature additions.

## License

This project is not licenced and I will only use it for educational purposes so you should also do the same 😊

## Contact

For further information or support, please reach out at:
- **Email:** darshitlimbad+git@example.com
- **LinkedIn:** [Don't click](https://www.linkedin.com/in/darshit-limbad/)

## `postReq(url, data, options)`

### Description

The `postReq` function is a custom AJAX utility that provides a standardized way to send asynchronous HTTP requests to the BotsApp server. It simplifies data communication and offers advanced features like progress tracking and request cancellation.

### Parameters

- **`url`:** (String) The URL of the target server-side endpoint. For example, `/functionality/lib/_chat.php`.
- **`data`:** (Object or String) Data to be sent with the request. This is usually JSON-encoded data for POST requests.
- **`options`:** (Object)  An optional object for customizing the request behavior. See table below for available options.

### Options Table

| Option                 | Type        | Description                                                                                        |
|--------------------------|--------------|-----------------------------------------------------------------------------------------------------|
| `method`               | String      | The HTTP method to use (e.g., "POST" by default or "GET").                                             |
| `async`                | Boolean     | Whether the request should be asynchronous (true by default).                                            |
| `Content_Type`          | String      | The content type of the request data (e.g., 'application/json' by default).                              |
| `onUploadProgress`     | Function    | Callback function for progress updates during file uploads. It receives a `Progress` object.        |
| `onDownloadProgress`    | Function    | Callback function for progress updates during file downloads. It receives a `Progress` object.       |
| `onDOwnloadAbortXMLOrNot` | Function    | Callback function to determine if the download should be aborted.                                   |
| `onUploadAbortXMLOrNot` | Function    | Callback function to determine if the upload should be aborted.                                   |


### Return Value

- **Promise:**  The `postReq` function returns a Promise that resolves with an object containing:
    - **`status`:** (String) "success" for a successful request, "error" for an error, or "abort" for an aborted request.
    - **`responseText`:** (String)  The server's response text. If the response is in JSON format, it is parsed into a JavaScript object.

### Example Usage

```javascript
// Send a POST request to the chat endpoint
postReq('/functionality/lib/_chat.php', JSON.stringify({ req: 'sendMsg', msg: 'Hello!' }))
    .then(response => {
        if (response.status === 'success') {
            console.log('Message sent successfully:', response.responseText);
        } else {
            console.error('Error sending message:', response.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
```

#### `Progress` Class

### Description

The `Progress` class provides a convenient structure for accessing progress information during file uploads and downloads. It contains information about the amount of data loaded, the total size, and whether the operation is complete.

### Properties

- **`done`:** (Boolean)  Indicates whether the operation is complete (`true`) or not (`false`).
- **`loaded`:** (Number) The amount of data that has been loaded so far.
- **`total`:** (Number) The total size of the data being transferred.
- **`timeStamp`:** (Number) The timestamp of the progress event.

### Example Usage

```javascript
const onUploadProgress = (progress) => {
    let progressPR = document.querySelector(".progressPR");
    progressPR.textContent = Math.ceil(progress.loaded * 100 / progress.total) + "%";
    
    if (progress.done) {
        progressPR.remove();
    }
};
```

## `Contact`

For further information or support, please reach out at:
- **Email:** darshitlimbad+git@example.com
- **LinkedIn:**
https://www.linkedin.com/in/darshit-limbad/