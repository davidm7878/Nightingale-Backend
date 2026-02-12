import express from "express";
const router = express.Router();
import {
  getAllPosts,
  getPostById,
  getPostsByUserId,
  createPost,
  updatePost,
  deletePost,
} from "#db/queries/posts";
import {
  getLikesByPostId,
  createLike,
  deleteLikeByUserAndPost,
  getLikeByUserAndPost,
} from "#db/queries/likes";
import {
  getDislikesByPostId,
  createDislike,
  deleteDislikeByUserAndPost,
  getDislikeByUserAndPost,
} from "#db/queries/dislikes";
import {
  getCommentsByPostId,
  createComment,
  deleteComment,
} from "#db/queries/comments";
import requireUser from "#middleware/requireUser";

// GET /posts - Get all posts with like/dislike counts
router.get("/", async (req, res, next) => {
  try {
    const posts = await getAllPosts();

    // Enrich posts with like/dislike counts
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const likes = await getLikesByPostId(post.id);
        const dislikes = await getDislikesByPostId(post.id);
        const comments = await getCommentsByPostId(post.id);
        return {
          ...post,
          likes: likes.length,
          dislikes: dislikes.length,
          comments: comments.length,
        };
      }),
    );

    res.json(enrichedPosts);
  } catch (error) {
    next(error);
  }
});

// GET /posts/:id - Get post by ID with like/dislike counts
router.get("/:id", async (req, res, next) => {
  try {
    const post = await getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likes = await getLikesByPostId(post.id);
    const dislikes = await getDislikesByPostId(post.id);
    const comments = await getCommentsByPostId(post.id);

    res.json({
      ...post,
      likes: likes.length,
      dislikes: dislikes.length,
      comments: comments.length,
    });
  } catch (error) {
    next(error);
  }
});

// GET /posts/user/:userId - Get posts by user ID
router.get("/user/:userId", async (req, res, next) => {
  try {
    const posts = await getPostsByUserId(req.params.userId);

    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const likes = await getLikesByPostId(post.id);
        const dislikes = await getDislikesByPostId(post.id);
        return {
          ...post,
          likes: likes.length,
          dislikes: dislikes.length,
        };
      }),
    );

    res.json(enrichedPosts);
  } catch (error) {
    next(error);
  }
});

// POST /posts - Create new post (requires authentication)
router.post("/", requireUser, async (req, res, next) => {
  try {
    const { body } = req.body;
    if (!body) {
      return res.status(400).json({ message: "Post body is required" });
    }

    const post = await createPost(req.user.id, body);
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
});

// PUT /posts/:id - Update post (requires authentication)
router.put("/:id", requireUser, async (req, res, next) => {
  try {
    const { body } = req.body;
    const post = await updatePost(req.params.id, body);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
});

// DELETE /posts/:id - Delete post (requires authentication)
router.delete("/:id", requireUser, async (req, res, next) => {
  try {
    const post = await deletePost(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
});

// POST /posts/:id/like - Like a post (requires authentication)
router.post("/:id/like", requireUser, async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Check if already liked
    const existingLike = await getLikeByUserAndPost(userId, postId);
    if (existingLike) {
      return res.status(400).json({ message: "Post already liked" });
    }

    // Remove dislike if it exists
    const existingDislike = await getDislikeByUserAndPost(userId, postId);
    if (existingDislike) {
      await deleteDislikeByUserAndPost(userId, postId);
    }

    const like = await createLike(userId, postId);
    const likes = await getLikesByPostId(postId);
    const dislikes = await getDislikesByPostId(postId);

    res.status(201).json({
      like,
      likes: likes.length,
      dislikes: dislikes.length,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /posts/:id/like - Unlike a post (requires authentication)
router.delete("/:id/like", requireUser, async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const like = await deleteLikeByUserAndPost(userId, postId);

    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }

    const likes = await getLikesByPostId(postId);
    const dislikes = await getDislikesByPostId(postId);

    res.json({
      message: "Like removed",
      likes: likes.length,
      dislikes: dislikes.length,
    });
  } catch (error) {
    next(error);
  }
});

// POST /posts/:id/dislike - Dislike a post (requires authentication)
router.post("/:id/dislike", requireUser, async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Check if already disliked
    const existingDislike = await getDislikeByUserAndPost(userId, postId);
    if (existingDislike) {
      return res.status(400).json({ message: "Post already disliked" });
    }

    // Remove like if it exists
    const existingLike = await getLikeByUserAndPost(userId, postId);
    if (existingLike) {
      await deleteLikeByUserAndPost(userId, postId);
    }

    const dislike = await createDislike(userId, postId);
    const likes = await getLikesByPostId(postId);
    const dislikes = await getDislikesByPostId(postId);

    res.status(201).json({
      dislike,
      likes: likes.length,
      dislikes: dislikes.length,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /posts/:id/dislike - Remove dislike from a post (requires authentication)
router.delete("/:id/dislike", requireUser, async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const dislike = await deleteDislikeByUserAndPost(userId, postId);

    if (!dislike) {
      return res.status(404).json({ message: "Dislike not found" });
    }

    const likes = await getLikesByPostId(postId);
    const dislikes = await getDislikesByPostId(postId);

    res.json({
      message: "Dislike removed",
      likes: likes.length,
      dislikes: dislikes.length,
    });
  } catch (error) {
    next(error);
  }
});

// GET /posts/:id/comments - Get all comments for a post
router.get("/:id/comments", async (req, res, next) => {
  try {
    const comments = await getCommentsByPostId(req.params.id);
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

// POST /posts/:id/comments - Add a comment to a post (requires authentication)
router.post("/:id/comments", requireUser, async (req, res, next) => {
  try {
    const { body } = req.body;
    if (!body) {
      return res.status(400).json({ message: "Comment body is required" });
    }

    const comment = await createComment(req.user.id, req.params.id, body);

    // Get updated comment count
    const comments = await getCommentsByPostId(req.params.id);

    res.status(201).json({
      comment,
      commentCount: comments.length,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /posts/:postId/comments/:commentId - Delete a comment (requires authentication)
router.delete(
  "/:postId/comments/:commentId",
  requireUser,
  async (req, res, next) => {
    try {
      const comment = await deleteComment(req.params.commentId);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      // Get updated comment count
      const comments = await getCommentsByPostId(req.params.postId);

      res.json({
        message: "Comment deleted",
        commentCount: comments.length,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
