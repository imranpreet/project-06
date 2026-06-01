const Blog = require('../models/Blog');
const CustomError = require('../utils/errors');

// Get All Blogs
exports.getAllBlogs = async (req, res, next) => {
  try {
    const { category, published } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (published !== undefined) filter.published = published === 'true';

    const blogs = await Blog.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs
    });
  } catch (error) {
    next(error);
  }
};

// Get Blog by ID
exports.getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name email');

    if (!blog) {
      throw new CustomError('Blog not found', 404);
    }

    res.status(200).json({
      success: true,
      blog
    });
  } catch (error) {
    next(error);
  }
};

// Create Blog
exports.createBlog = async (req, res, next) => {
  try {
    const { title, content, category, tags } = req.body;

    // Validation
    if (!title || !content) {
      throw new CustomError('Please provide title and content', 400);
    }

    const blog = await Blog.create({
      title,
      content,
      category: category || 'Other',
      tags: tags || [],
      author: req.user.id
    });

    const populatedBlog = await blog.populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog: populatedBlog
    });
  } catch (error) {
    next(error);
  }
};

// Update Blog
exports.updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, category, tags, published } = req.body;

    let blog = await Blog.findById(id);

    if (!blog) {
      throw new CustomError('Blog not found', 404);
    }

    // Check authorization
    if (blog.author.toString() !== req.user.id) {
      throw new CustomError('Not authorized to update this blog', 403);
    }

    // Update fields
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.category = category || blog.category;
    blog.tags = tags || blog.tags;
    blog.published = published !== undefined ? published : blog.published;
    blog.updatedAt = Date.now();

    blog = await blog.save();
    blog = await blog.populate('author', 'name email');

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      blog
    });
  } catch (error) {
    next(error);
  }
};

// Delete Blog
exports.deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      throw new CustomError('Blog not found', 404);
    }

    // Check authorization
    if (blog.author.toString() !== req.user.id) {
      throw new CustomError('Not authorized to delete this blog', 403);
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get User's Blogs
exports.getUserBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ author: req.user.id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs
    });
  } catch (error) {
    next(error);
  }
};
