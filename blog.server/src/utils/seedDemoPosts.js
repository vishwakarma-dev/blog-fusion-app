const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');

const User = require('../models/User');
const BlogPost = require('../models/BlogPost');

dotenv.config();

const demoTitles = [
  'The Future of JavaScript',
  'Top 10 VS Code Extensions',
  'Why MongoDB Rocks',
  'React Performance Tips',
  'Mastering CSS Grid',
  'Understanding Closures',
  'Building RESTful APIs',
  'Authentication with JWT',
  'State Management in React',
  'Exploring ES2025 Features',
  'Debugging Node.js Apps',
  'Optimizing Frontend Performance',
  'Responsive Design Principles',
  'Modern JavaScript Best Practices',
  'How to Use React Hooks Effectively',
  'Deploying Apps with Vercel',
  'Intro to Next.js',
  'Working with MongoDB Aggregations',
  'Using Mongoose like a Pro',
  'Securing Express Apps'
];

// Optional: Array of free image URLs
const imageSamples = [
  'https://source.unsplash.com/800x400/?technology,code',
  'https://source.unsplash.com/800x400/?programming',
  'https://source.unsplash.com/800x400/?javascript',
  'https://source.unsplash.com/800x400/?developer',
  'https://source.unsplash.com/800x400/?webdesign',
  'https://source.unsplash.com/800x400/?reactjs',
  'https://source.unsplash.com/800x400/?nodejs',
  'https://source.unsplash.com/800x400/?frontend',
  'https://source.unsplash.com/800x400/?backend',
  'https://source.unsplash.com/800x400/?coding',
];

const getRandomImage = () =>
  imageSamples[Math.floor(Math.random() * imageSamples.length)];

const generatePost = (title, count, authorId) => {
  const slug = slugify(`${title}-${count}`, { lower: true, strict: true });
  return {
    author_id: authorId,
    title: `${title} ${count}`,
    slug,
    content: `This is a demo post titled "${title} ${count}". It covers various interesting topics related to modern web development.`,
    tags: ['demo', 'tech', 'blog'],
    image_URL: getRandomImage(),
    createdAt: new Date(),
  };
};

const seedDemoPosts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const user = await User.findOne();
    if (!user) {
      console.error('❌ No user found. Please create a user first.');
      return process.exit(1);
    }

    const postsToCreate = 20;
    const demoPosts = [];

    for (let i = 0; i < postsToCreate; i++) {
      const title = demoTitles[i % demoTitles.length];
      const post = generatePost(title, i + 1, user._id);
      demoPosts.push(post);
    }

    await BlogPost.insertMany(demoPosts);
    console.log(`✅ ${postsToCreate} demo blog posts created successfully!`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding demo posts:', err.message);
    process.exit(1);
  }
};

seedDemoPosts();
