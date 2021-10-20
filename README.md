This project provides a register/login functionality with authentication calls.

As a user you can like and unlike other users, you can also see user information based on their id, or even see who are the users with the most likes.


## Why MongoDB? ##

MongoDB is used to store all the data. There are 2 tables (`users` and `user_likes`).

In the `users` table(collection) we are storing the user information including the hashed password.

In the `user_likes` table we are storing all the actions(in our case all the likes) that users invoke upon each other.
Everytime a user likes another user , we add an entry in `user_likes` table with their corresponding id-s.
Everytime a user unlikes another user, we remove the entry from the table.
Based on this flow, we can easily find the number of likes by just counting the entries of that user(id) in the `user_likes` table.

Since we know the access-points that are going to be used by the API-s, all the calls are done on the `_id` or on the indexed field `email`, so we are achieving O (1) complexity.