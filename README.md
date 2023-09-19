
# SW Chat App


## Collaborators

 - Jakub Zolkos
 - Zachary Tan

## Description

Our chat app allows you to talk to your friends and family. Just simply sign in with your email or Google account and you can talk freely to whoever has an account. You can also pick and choose who you want to add to your friends list and talk to them instead.
## Design Decisions

We began our chat app project by deciding how we wanted to create it and which programming language to use. Ultimately, we settled on using React Native Expo as the foundation of our app. We chose React Native Expo because we believe it excels as a platform for designing and developing apps, aligning with our goal of creating a user-friendly application. Additionally, it enables a seamless integration between JavaScript, HTML, and CSS, allowing us to create an easily comprehensible user interface. This choice is especially important because a chat app should be simple to use.

For the backend and database, we decided to go with Google Firebase. This decision allows us to easily implement Google login and store information for both new and existing users in a collection. When a returning user wishes to log in, the system checks the collection, and if the user information matches, it grants access. Google Firebase also permits us to store chat messages in a collection, so when a user opens a chat with another user, it retrieves the messages from the collection. For this part of the code, we utilized ChatGPT and a video by [Code with Beto](https://www.youtube.com/watch?v=Ov3Z3vD5zFw&t=221s).

Firebase also enables us to implement a search function. With a collection of all users in the Firestore database, we can retrieve user names and profiles. Users can then select the person they wish to chat with, opening a chat with that user. The search function streamlines the list of potential contacts, allowing users to search by name or email. We used resources such as ChatGPT and a video by [Code Commerce](https://www.youtube.com/watch?v=xAqCEBFGdYk) for this functionality.
## Tools
- [React Native Expo](https://docs.expo.dev/tutorial/create-your-first-app/) for the front end part
- [Google Firebase](https://firebase.google.com/docs/web/setup) for back end: User authentication and chat storage
## Demo

Here is a Youtube link to watch the [demo](https://youtu.be/QXBQiwrHVHw) of our chat app. For screenshots of our app, please check Documentation => Screenshots for different examples of our app being used. Acknowledgments are listed in the Design Decisions section of this README. Testing and results are listed in the Documentation folder.
