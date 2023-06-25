const Joi = require('joi');
const myCustomJoi = Joi.extend(require('joi-phone-number'));
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');


const app = express();
app.use(express.json());
const port = 3001;
//const router = express.Router();

app.use(cors());


// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  port: 3306,
  //password: 'N8821446c',
  password: '123456',
  database: 'fullstack7',
});



// Helper function to execute database queries
const executeQuery = (query, params, callback) => {
  pool.getConnection((error, connection) => {
    if (error) {
      callback(error, null);
    } else {
      connection.query(query, params, (err, results) => {
        connection.release();
        callback(err, results);
      });
    }
  });
};

//Helper function to get all objects in table (fit the query if exist)
const getAllObjects = (res, tableName, userQuery, schema) => {
  let query = `SELECT * FROM ${tableName}`;
  let values = [];

  if (Object.keys(userQuery).length > 0) {
    
    const { error } = schema.validate(userQuery);
  
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const whereClause = Object.keys(userQuery).map(field => `${field} = ?`).join(' and ');
    values = Object.values(userQuery);
    query += ` WHERE ${whereClause}`;
  }
  
  executeQuery(query, values, (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.json(results);
    }
  });
}

//Helper function to get object by id and send it
const getObjectById = (objectId, res, tableName, objectType) => {
  const query = `SELECT * FROM ${tableName} WHERE id = ?`;
  executeQuery(query, [objectId], (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: `${objectType} not found` });
      } else {
        res.json(results[0]);
      }
    }
  });
}

//Helper function to create new object
const createObject = (body, res, tableName, schema, objectType) => {
  const { error } = schema.validate(body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const keys = Object.keys(body);
  const values = Object.values(body);
  const valuesClause = values.map(v => '?').join(', ');

  const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${valuesClause})`;
  pool.query(query, values, (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(201).json({ message: `${objectType} created successfully` });
    }
  });
}

//Helper function to update object by id
const updateObjectById = (objectId, body, res, tableName, schema, objectType) => {
  const updatedFields = body;
  const { error } = schema.validate(updatedFields);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  } else if(Object.keys(updatedFields).length === 0) {
    res.status(400).json({error: "No field to update"});
  }
  
  // Construct SET clause dynamically based on updatedFields
  const setClause = Object.keys(updatedFields).map(field => `${field} = ?`).join(', ');
  const values = Object.values(updatedFields);

  const query = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;
  values.push(objectId);

  pool.query(query, values, (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ message: `${objectType} not found` });
      } else {
        res.json({ message: `${objectType} updated successfully` });
      }
    }
  });
}

//Helper function to delete object by id
const deleteObjectById = (objectId, res, tableName, objectType) => {
  const query = `DELETE FROM ${tableName} WHERE id = ?`;

  pool.query(query, [objectId], (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ message: `${objectType} not found` });
      } else {
        if (results.affectedRows === 0) {
          res.status(404).json({ message: `${objectType} not found` });
        } else {
          res.json({ message: `${objectType} deleted successfully` });
        }
      }
    }
  });
}

/*
**********************USER******************************

*/
// get all users (or all users fit the query)
app.get('/api/users', (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(1),
    username: Joi.string().min(1),
    email: Joi.string().email(),
    phone: myCustomJoi.string().phoneNumber(),
    website: Joi.string().min(1)
  });

  getAllObjects(res, 'users', req.query, schema);
});

//get Spesific user (by userId)
app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  getObjectById(userId, res, 'users', 'User');
});


app.post('/api/login', (req, res) => {
    const { Email, password } = req.body;
  
    // Perform the database query
    pool.query(
      'SELECT * FROM useraccount WHERE Email = ? AND UserPassword = ?',
      [Email, password],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.json({ success: false });
        }
  
        // Check if a matching user record is found
        if (results.length > 0) {
          // Save user information in local storage
          const user = results[0];
         
  
         return res.json({ success: true, user });
        } else {
          return res.json({ success: false });
        }
      }
    );
  });
  

// Create a new user
app.post('/api/users', (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    username: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    phone: myCustomJoi.string().phoneNumber().required(),
    website: Joi.string().min(1).required()
  });
  createObject(req.body, res, 'users', schema, 'User');
});


// Delete user by userId
app.delete('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  deleteObjectById(userId, res, 'users', 'User');
});

// Update user's variable field by userId
app.put('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  const schema = Joi.object({
    name: Joi.string().min(1),
    email: Joi.string().email(),
    phone: myCustomJoi.string().phoneNumber(),
    website: Joi.string().min(1)
  });

  updateObjectById(userId, req.body, res, 'users', schema, 'User');

});

/**
 * ************************END USER*********************************************************
 */

/**
 * ************************PASSWORD*********************************************************
 */

//get the password of Spesific user
app.get('/api/passwords/:username', (req, res) => {
  const { username } = req.params;
  const query = 'SELECT password FROM passwords WHERE username = ?';
  console.log('Query:', query);
  console.log('userName:', username);
  executeQuery(query, [username], (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      if (results.length === 0) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.json(results[0]);
      }
    }
  });
});

app.post('/api/passwords', (req, res) => {
  const schema = Joi.object({
    username: Joi.string().min(1).required(),
    password: Joi.string().min(6).required()
  });

  createObject(req.body, res, 'passwords', schema, 'Password');
});

app.put('/api/passwords/:username', (req, res) => {
  const { username } = req.params;
  const { currentPassword, newPassword } = req.body;

  // Verify the current password before updating
  const verifyQuery = 'SELECT password FROM passwords WHERE username = ?';
  executeQuery(verifyQuery, [username], (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      if (results.length === 0) {
        res.status(404).json({ message: 'User not found' });
      } else {
        const storedPassword = results[0].password;
        if (storedPassword !== currentPassword) {
          res.status(401).json({ message: 'Invalid current password' });
        } else {
          // Update the password in the database
          const updateQuery = 'UPDATE passwords SET password = ? WHERE username = ?';
          executeQuery(updateQuery, [newPassword, username], (updateError) => {
            if (updateError) {
              res.status(500).json({ error: updateError });
            } else {
              res.json({ message: 'Password updated successfully' });
            }
          });
        }
      }
    }
  });
});




/**
 * ************************END PASSWORD*********************************************************
 */

/**
 * ****************************TODOS***********************
 */

// retrieve all todos
app.get('/api/todos', (req, res) => {
  const schema = Joi.object({
    userId: Joi.number().min(1),
    title: Joi.string().min(1),
    complete: Joi.number().min(0).max(1)
  });
  const query = req.query;
  if (query.complete !== undefined) {
    query.complete = query.complete === 'true' ? 1 : 0;
  }
  getAllObjects(res, 'todos', query, schema);
});

// retrieve a specific todo
app.get('/api/todos/:todoId', (req, res) => {
  const { todoId } = req.params;
  getObjectById(todoId, res, 'todos', 'Todo');
});

// retrieve todos for a specific user
app.get('/api/users/:userId/todos', (req, res) => {
  const userId = req.params.userId;
  const schema = Joi.object({
    userId: Joi.number().min(1).required()
  });
  getAllObjects(res, 'todos', {userId}, schema);
});

// to create a new todo
app.post('/api/todos', (req, res) => {
  const schema = Joi.object({
    userId: Joi.number().min(1).required(),
    title: Joi.string().min(1).required(),
    complete: Joi.number().min(0).max(1).required()
  });
  const body = req.body;
  if (body.complete !== undefined) {
    body.complete = body.complete ? 1 : 0;
  }
  createObject(body, res, 'todos', schema, 'Todo');
});


app.put('/api/todos/:todoId', (req, res) => {
  const todoId = req.params.todoId;
  const schema = Joi.object({
    userId: Joi.number().min(1),
    title: Joi.string().min(1),
    complete: Joi.number().min(0).max(1)
  });
  const body = req.body;
  if (body.complete !== undefined) {
    body.complete = body.complete ? 1 : 0;
  }
  updateObjectById(todoId, body, res, 'todos', schema, 'Todo');
});



// to delete a todo
app.delete('/api/todos/:todoId', (req, res) => {
  const todoId = req.params.todoId;
  deleteObjectById(todoId, res, 'todos', 'Todo');
});

/**
 * ************************END TODOS*********************************************************
 */

/**
 * ************************POSTS*********************************************************
 */

// retrieve all posts
app.get('/api/posts', (req, res) => {
    const schema = Joi.object({
      userId: Joi.number().min(1),
      title: Joi.string().min(1),
      body: Joi.string().min(1)
    });
    getAllObjects(res, 'posts', req.query, schema);
});

// retrieve a specific post
app.get('/api/posts/:postId', (req, res) => {
  const { postId } = req.params;
  getObjectById(postId, res, 'posts', 'Post');
});

// retrieve posts for a specific user
app.get('/api/users/:userId/posts', (req, res) => {
  const userId = req.params.userId;
  const schema = Joi.object({
    userId: Joi.number().min(1).required()
  });
  getAllObjects(res, 'posts', {userId}, schema);
});

// to create a new post
app.post('/api/posts', (req, res) => {
  const schema = Joi.object({
    userId: Joi.number().min(1).required(),
    title: Joi.string().min(1).required(),
    body: Joi.string().required()
  });
  createObject(req.body, res, 'posts', schema, 'Post');
});


// to update a post
app.put('/api/posts/:postId', (req, res) => {
  const postId = req.params.postId;
  const schema = Joi.object({
    title: Joi.string().min(1),
    body: Joi.string()
  });
  updateObjectById(postId, req.body, res, 'posts', schema, 'Post');
});

// to delete a post
app.delete('/api/posts/:postId', (req, res) => {
  const postId = req.params.postId;
  deleteObjectById(postId, res, 'posts', 'Post');
});

/**
 * ************************COMMENTS*********************************************************
 */

// retrieve all comments
app.get('/api/comments', (req, res) => {
  const schema = Joi.object({
    postId: Joi.number().min(1),
    name: Joi.string().min(1),
    email: Joi.string().email(),
    body: Joi.string().min(1)
  });
  getAllObjects(res, 'comments', req.query, schema);
});

// retrieve a specific comment
app.get('/api/comments/:commentId', (req, res) => {
  const { commentId } = req.params;
  getObjectById(commentId, res, 'comments', 'Comment');
});

// retrieve comments for a specific post
app.get('/api/posts/:postId/comments', (req, res) => {
  const postId = req.params.postId;
  const schema = Joi.object({
    postId: Joi.number().min(1).required()
  });
  getAllObjects(res, 'comments', {postId}, schema);
});

// to create a new comment
app.post('/api/comments', (req, res) => {
  const schema = Joi.object({
    postId: Joi.number().min(1).required(),
    name: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    body: Joi.string().min(1).required()
  });
  createObject(req.body, res, 'comments', schema, 'Comment');
});

// to update a comment
app.put('/api/comments/:commentId', (req, res) => {
  const commentId = req.params.commentId;
  const schema = Joi.object({
    name: Joi.string().min(1),
    email: Joi.string().email(),
    body: Joi.string().min(1)
  });
  updateObjectById(commentId, req.body, res, 'comments',schema, 'Comment');
});

// to delete a comment
app.delete('/api/comments/:commentId', (req, res) => {
  const commentId = req.params.commentId;
  deleteObjectById(commentId, res, 'comments', 'Comment');
});

/**
 * ************************ALBUMS*********************************************************
 */

// retrieve all albums
app.get('/api/albums', (req, res) => {
  const schema = Joi.object({
    userId: Joi.number().min(1),
    title: Joi.string().min(1),
  });
  getAllObjects(res, 'albums', req.query, schema);
});

// retrieve a specific album
app.get('/api/albums/:albumId', (req, res) => {
  const { albumId } = req.params;
  getObjectById(albumId, res, 'albums', 'Album');
});

// retrieve albums for a specific user
app.get('/api/users/:userId/albums', (req, res) => {
  const userId = req.params.userId;
  const schema = Joi.object({
    userId: Joi.number().min(1).required()
  });
  getAllObjects(res, 'albums', {userId}, schema);
});


// to create a new album
app.post('/api/albums', (req, res) => {
  const schema = Joi.object({
    userId: Joi.number().min(1).required(),
    title: Joi.string().min(1).required(),
  });
  createObject(req.body, res, 'albums', schema, 'Album');
});


// to update a album
app.put('/api/albums/:albumId', (req, res) => {
  const albumId = req.params.albumId;
  const schema = Joi.object({
    title: Joi.string().min(1),
  });
  updateObjectById(albumId, req.body, res, 'albums', schema, 'Album');
});

// to delete a album
app.delete('/api/albums/:albumId', (req, res) => {
  const albumId = req.params.albumId;
  deleteObjectById(albumId, res, 'albums', 'Album');
});

// Route to retrieve albums with maximum ID for a specific user

app.get('/api/users/:userId/albums/maxId', (req, res) => {
  const { userId } = req.params;

  // Execute the SQL query
  const query = `
    SELECT *
    FROM albums
    WHERE userId = ?
    AND id = (
      SELECT MAX(id)
      FROM albums
      WHERE userId = ?
    )
  `;

  executeQuery(query, [userId, userId], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ message: 'Album not found' });
      } else {
        res.json(results[0]);
      }
    }
  });
});



/**
* ************************PHOTOS*********************************************************
*/

// retrieve all photos
app.get('/api/photos', (req, res) => {
  const schema = Joi.object({
    albumId: Joi.number().min(1),
    title: Joi.string().min(1),
    url: Joi.string().min(1),
    thumbnailUrl: Joi.string().min(1)
  });
  getAllObjects(res, 'photos', req.query, schema);
});

// retrieve a specific photo
app.get('/api/photos/:photoId', (req, res) => {
  const { photoId } = req.params;
  getObjectById(photoId, res, 'photos', 'Photo');
});

// retrieve photo for a specific album
app.get('/api/albums/:albumId/photos', (req, res) => {
  const albumId = req.params.albumId;
  const schema = Joi.object({
    albumId: Joi.number().min(1).required()
  });
  getAllObjects(res, 'photos', {albumId}, schema);
});

// to create a new photo
app.post('/api/photos', (req, res) => {
const schema = Joi.object({
  albumId: Joi.number().min(1).required(),
  title: Joi.string().min(1).required(),
  url: Joi.string().min(1).required(),
  thumbnailUrl: Joi.string().min(1).required()
});
createObject(req.body, res, 'photos', schema, 'Photo');
});

// to update a photo
app.put('/api/photos/:photoId', (req, res) => {
const photoId = req.params.photoId;
const schema = Joi.object({
  title: Joi.string().min(1),
  url: Joi.string().min(1),
  thumbnailUrl: Joi.string().min(1)
});
updateObjectById(photoId, req.body, res, 'photos',schema, 'Photo');
});

// to delete a photo
app.delete('/api/photos/:photoId', (req, res) => {
  const photoId = req.params.photoId;
  deleteObjectById(photoId, res, 'photos', 'Photo');
});

// Mount the router
//app.use(router);

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});