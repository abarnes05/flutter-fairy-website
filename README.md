# flutter-fairy-website

Project Summary:
This project is a website that displays a game in the center and a navbar at the bottom. The game is called Flutter Fairy (based off of Flappy Bird) and I had originally coded it in C++ for my Advanced Programming final project. Now it’s coded in JavaScript and it is displayed on a cute html webpage. 

There is index.html, labelled “Game” on the navbar. This is the webpage where the game is displayed and can be played.
There is how-to-play.html, labelled “How To Play” on the navbar. This webpage contains a textbox explaining how to play.
There is leaderboard.html, labelled “Leaderboard” on the navbar. This webpage displays the game leaderboard and you can also be directed to it after making a leaderboard submission at the end of the game. 

When you run into an obstacle, the game will end and you can either choose to restart the game or add your score to the leaderboard. If you click the "Add to Leaderboard" button, a leaderboard submission form pops up and asks you for your name. When you submit this form, your name and score will be saved to localStorage and your entry will be added to the leaderboard which is then also saved to localStorage. If you made a submission, you will be redirected to the leaderboard webpage which sorts the entries by highest score and loads them into a leaderboard table with the 10 highest scores.

There is also JS validation for the leaderboard submission form. You will get an alert if you try and submit the form without typing a name or if you’re trying to submit a score of 0.

I have a media query which centers the navbar links and makes them fill the width of the page on smaller screens.
