<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>LectureLink</title>
    <link rel="stylesheet" href="css/master.css">
    <script src="https://kit.fontawesome.com/6388507e5f.js" crossorigin="anonymous"></script>
  </head>
  <body>
    <header id=main-header>
      <h1 id=main-title>Lecture<span class="title-link">Link</span></h1>
      <div id=account-settings>
        <p><span>Account</span><i class="far fa-user-circle fa-2x"></i></p>
      </div>
    </header>
    <main id=messages-wrap>
      <aside id=main-nav>
        <h2>Live Sessions</h2>
        <section id=join-session>
          <input type="text" name="" maxlength="4" placeholder="XXXX">
          <button type="button">Join Session</button>
          <p>or <a href="#start-session">Start a session</a></p>
        </section>
        <h2>Messages</h2>
        <nav class="n2-controls">
          <ul>
            <li>
              <a href="#">
                <span class="n2-icon"><i class="far fa-envelope"></i></i></span>
                <span class="n2-dest">All Messages</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span class="n2-icon"><i class="fas fa-envelope"></i></span>
                <span class="n2-dest">Unread Messages</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span class="n2-icon"><i class="fas fa-plus"></i></span>
                <span class="n2-dest">Start a conversation</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span class="n2-icon"><i class="fas fa-archive"></i></span>
                <span class="n2-dest">Archived Messages</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span class="n2-icon"><i class="fas fa-users"></i></span>
                <span class="n2-dest">Previous Sessions</span>
              </a>
            </li>
          </ul>
        </nav>
        <h2>Connections</h2>
        <nav class="n2-controls">
          <ul>
            <li>
              <a href="#">
                <span class="n2-icon"><i class="fas fa-compass"></i></span>
                <span class="n2-dest">Discover People</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span class="n2-icon"><i class="fas fa-chalkboard-teacher"></i></span>
                <span class="n2-dest">Your Lecturers</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span class="n2-icon"><i class="fas fa-user-graduate"></i></span>
                <span class="n2-dest">Saved Students</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span class="n2-icon"><i class="fas fa-handshake"></i></span>
                <span class="n2-dest">Share your username</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <aside id=conversations>
        <div class="conversation open">
          <div class="conv-parties">
            <p>John Doe</p>
          </div>
          <div class="conv-preview">
            <q>Hey! I was just wondering if you comple...</q>
          </div>
          <div class="conv-info">
            <p>
              <time class="conv-time">3hrs</time> |
              <span class="conv-read">S</span>
            <p>
          </div>
        </div>
        <div class="conversation">
          <div class="conv-parties">
            <p>King Henry VIII</p>
          </div>
          <div class="conv-preview">
            <q>If I don't get this divorce you'l...</q>
          </div>
          <div class="conv-info">
            <p>
              <time class="conv-time">2days</time> |
              <span class="conv-read">R</span>
            <p>
          </div>
        </div>
        <div class="conversation unread">
          <div class="conv-parties">
            <p>Jane Doe</p>
          </div>
          <div class="conv-preview">
            <q>Remember to bring your coursework tomorro...</q>
          </div>
          <div class="conv-info">
            <p>
              <time class="conv-time">3hrs</time> |
              <span class="conv-read">W</span>
            <p>
          </div>
        </div>
        <p class="conv-end"><i class="fas fa-comment-slash"></i> No more messages<p>
      </aside>
      <div id=messages-container>
        <section id=messages>
          <div class="message inbound">
            <p class="mes-party">Jon Doe</p>
            <div class="mes-bubble">
              <div class="mes-text">
                <p>Hey! I was just wondering if you completed your assignment?</p>
              </div>
            </div>
            <time class="mes-info">3hrs ago</time>
          </div>
          <div class="message outbound">
            <p class="mes-party">You</p>
            <div class="mes-bubble">
              <div class="mes-text">
                <p>Almost, I'll message you back when it's done. Shouldn't be long!</p>
              </div>
            </div>
            <time class="mes-info">2hrs ago</time>
          </div>
        </section>
        <form id=new-message>
          <input type="text" name="message" value="" placeholder="Enter a message...">
          <button type="submit">Send</button>
        </form>
      </div>
    </main>
  </body>
</html>
