import prisma from "../lib/prisma.js";

export const getAllUsers = async (req, res) => {
  if (req.user.userType !== "Admin")
    return res.status(403).json("Access denied");

  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true, userType: true, createdAt: true },
  });

  res.json(users);
};

export const deleteUser = async (req, res) => {
  if (req.user.userType !== "Admin")
    return res.status(403).json("Access denied");

  await prisma.user.delete({ where: { id: req.params.id } });
  res.json("User deleted");
};

export const getAllPosts = async (req, res) => {
  if (req.user.userType !== "Admin")
    return res.status(403).json("Access denied");

  const posts = await prisma.post.findMany({
    include: { user: { select: { username: true, email: true } }, postDetail: true },
    orderBy: { createdAt: "desc" },
  });

  res.json(posts);
};

export const deletePost = async (req, res) => {
  if (req.user.userType !== "Admin")
    return res.status(403).json("Access denied");

  await prisma.post.delete({ where: { id: req.params.id } });
  res.json("Post deleted");
};
