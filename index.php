<?php
    include_once("interface.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Personal Chat -- BOTSAPP</title>

    <link rel="stylesheet" type="text/css" href="css/index.css">

    <script src="js/index.js"></script>
    <script src="/js/lib/_dsa.js"></script>
</head>
<body>

    <div class="center">
    <!-- chat-box -->
    <div class="chat-box bg-img">
        <!-- chat-list -->
        <div class="inbox">

            <div class="page-name">
                <h2 id="cname">Personal Chat</h2>
            </div>
            
            <div class="hr"></div>
            
            <!-- search-box -->
            <div class="search">
                <input type="search" name="seach" placeholder="search" autocomplete="off" accesskey="f">
            </div>
            
            <table class="list"> 
                <tbody class="listBody">

                </tbody>
            </table>
        </div>

        <!-- opened-chat -->
        <div class="chat">
        <div class="headding align-center">
                <div class="icon center align-center" title="Close" name="close-chat">
                    <img src="img/icons/close.png" alt="close">
                </div>

                <div class="dp align-center">
                    <img src="img/default_dp.png" alt="dp">
                </div>
                
                <div class="details">
                    <div class="name"> </div>                    
                    <div class="status green">
                        offline
                    </div>
                </div>

                <div class="search-btn icon align-center" onclick="toggleSearchTxt();">
                    <img src="img/icons/search.png" alt="seach">
                </div>
            </div>

            <div class="search" id="searchTxt">
                <input type="search" name="seachTxtInput" placeholder="search" autocomplete="off" oninput="_searchWords(this.value.trim())" >
                <span class="search_found_span"><span>0</span>/<span>1</span></span>
                <div class="move">
                    <button class="up" title="Up" onclick="moveSearch(this.title)"> < </button>
                    <button class="down" title="Down" onclick="moveSearch(this.title)" > > </button>
                </div>
            </div>
            

            <div class="chatBody">

                <div class="msgDate">23/2/24</div>
                
                <div class="msgContainer receive">
                    <div class="msg">
                        hello brother how are you hello  newbi hello hello hello hello doing in life hope yor will be fine :)
                        see you soon
                    </div>
                    <div class="msgTime">6:00 PM</div>
                </div>

                <div class="msgContainer send">
                    <div class="msgTime">0:00 PM</div>
                    <div class="msg">i am fine hello thanks</div>
                </div>
                <div class="center">
                    <div class="msgDate">23/2/24</div>
                </div>
                
                <div class="msgContainer receive">
                    <div class="msg">hello brother how hello are you doing in life hope yor will be fine :)
                        see you soon
                    </div>
                    <div class="msgTime">6:00 PM</div>
                </div>

            </div>
            
            <div class="footer align-center">
                <div class="upDocsBtn ele" title="send Documents">+</div>

                <div class="upDocsContainer">
                    <div class="node ele" name="sendImgBtn" title="Send Image">
                        <svg height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                        viewBox="0 0 455 455" xml:space="preserve" >
                        <path d="M0,0v455h455V0H0z M259.405,80c17.949,0,32.5,14.551,32.5,32.5s-14.551,32.5-32.5,32.5s-32.5-14.551-32.5-32.5
                            S241.456,80,259.405,80z M375,375H80v-65.556l83.142-87.725l96.263,68.792l69.233-40.271L375,299.158V375z"/>
                        </svg>
                    </div>
                    <div class="node ele" name="sendFilesBtn" title="Send Files">
                        <svg width="20px" height="20px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" stroke-width="3" stroke="rgba(255, 255, 255, 0.349)" fill="none"><path d="M49.78,31.63,32,49.39c-2.09,2.09-10.24,6-16.75-.45-4.84-4.84-5.64-11.75-.95-16.58,5-5.17,15.24-15.24,20.7-20.7,2.89-2.89,7.81-4.28,12.17.07s2.41,9.44,0,11.82L27.81,43a4.61,4.61,0,0,1-6.89-.06c-2.19-2.19-1.05-5.24.36-6.66l18-17.89"/></svg>
                    </div>
                </div>

                <textarea class="msgInput ele" placeholder="Type a Message" autocomplete="off" accesskey="m" lang="en," title="Type a Message"></textarea>

                <div class="sendMsg">
                    <img src="img/icons/send.png" alt="Send Message">
                </div>
            </div>

        </div>

    </div>
    </div>
</body>
</html>