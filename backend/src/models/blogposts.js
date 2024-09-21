import { db } from "../database.js"

export function newBlogpost (
    id,
    datetime,
    title,
    content,
    user_id,
) {
    return {
        id,
        datetime,
        title,
        content,
        user_id,
    }
}

// Get all blog posts
export async function getAll() {
    const [allBlogpostsResults] = await db.query("SELECT * FROM blogposts ORDER BY datetime DESC")

    return await allBlogpostsResults.map((blogpostResult) =>
        newBlogpost(
            blogpostResult.id.toString(),
            blogpostResult.datetime,
            blogpostResult.title,
            blogpostResult.content,
            blogpostResult.user_id,
        ))
}

// Get post by post ID
export async function getBlogByID(blogpostID) {
    const [blogpostsResults] = await db.query("SELECT * FROM blogposts WHERE id = ?", blogpostID)
  
    if (blogpostsResults.length > 0) {
      const blogpostResult = blogpostsResults[0];
      return Promise.resolve(
        newBlogpost(
            blogpostResult.id.toString(),
            blogpostResult.datetime,
            blogpostResult.title,
            blogpostResult.content,
            blogpostResult.user_id,
        )
      )
    } else {
      return Promise.reject("no results found");
    }
}

  // Get post by user ID
export async function getByUserID(userID) {
    const [allBlogpostsResults] = await db.query("SELECT * FROM blogposts WHERE user_id = ?", userID)
  
    return await allBlogpostsResults.map((blogpostResult) =>
    newBlogpost(
        blogpostResult.id.toString(),
        blogpostResult.datetime,
        blogpostResult.title,
        blogpostResult.content,
        blogpostResult.user_id,
    ))
}

// Create blog post
export async function create(blogpost) {
    delete blogpost.id

    return db.query(
        "INSERT INTO blogposts (datetime, title, content, user_id) "
        + "VALUE (?, ?, ?, ?)",
        [
            blogpost.datetime,
            blogpost.title,
            blogpost.content,
            blogpost.user_id
        ]
    ).then(([result]) => {
        return { ...blogpost, id: result.insertId }
    })
}

//Delete blog post
export async function deleteByID(blogpostID) {
    return db.query("DELETE FROM blogposts WHERE id = ?", [blogpostID]);
}

