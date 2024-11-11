const sql = require("./db.js");

// constructor
const Comment = function (comment) {
  this.user_id = comment.user_id;
  this.post_id = comment.post_id;
  this.comment = comment.comment;
  this.reg_date = comment.reg_date;
};

Comment.create = (model, result) => {
  sql.query("INSERT INTO comments SET ?", model, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...model });
  });
};

Comment.findById = (id, result) => {
  sql.query(
    `SELECT comments.*, posts.*, users.first_name, users.last_name, users.attach, users.handle FROM comments left join posts on comments.post_id = posts.id left join users on users.id = comments.user_id WHERE comments.post_id = ${id} `,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      return result(null, res);
    }
  );
};

Comment.getAll = (result) => {
  let query = `SELECT comments.*, posts.*, users.first_name, users.last_name, users.attach FROM comments left join posts on comments.post_id = posts.id left join users on users.id = comments.user_id WHERE 1=1 `;

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

Comment.updateById = (id, comment, result) => {
  sql.query(
    "UPDATE comments SET content = ?, post_id, user_id = ? WHERE id = ?",
    [comment.content, comment.post_id, comment.user_id, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Tutorial with the id
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: id, ...comment });
    }
  );
};

Comment.remove = (id, result) => {
  sql.query("DELETE FROM comments WHERE id = ?", id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Tutorial with the id
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, res);
  });
};

Comment.removeAll = (result) => {
  sql.query("DELETE FROM comments", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};

module.exports = Comment;
