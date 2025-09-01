const chalk = require('chalk');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

const setupDB = require('./db');
const { ROLES } = require('../constants');
const User = require('../models/user');
const Brand = require('../models/brand');
const Product = require('../models/product');
const Category = require('../models/category');

const args = process.argv.slice(2);
const email = args[0];
const password = args[1];

const NUM_PRODUCTS = 60;
const NUM_BRANDS = 15;
const NUM_CATEGORIES = 15;

const USE_FAKER_IMAGE = false; // Set to false to use predefined images
const NUM_PREDEFINED_IMAGES = 47; // Number of predefined images

const seedDB = async () => {
  try {
    let categories = [];
    let usedImageNumbers = new Set(); // Track used image numbers

    console.log(`${chalk.blue('✓')} ${chalk.blue('Seed database started')}`);

    if (!email || !password) throw new Error('Missing arguments');
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Seeding admin user...')}`);
      const user = new User({
        email,
        password,
        firstName: 'admin',
        lastName: 'admin',
        role: ROLES.Admin
      });

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
      await user.save();
      console.log(`${chalk.green('✓')} ${chalk.green('Admin user seeded.')}`);
    } else {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Admin user already exists, skipping seeding for admin user.')}`);
    }

    const categoriesCount = await Category.countDocuments();
    if (categoriesCount >= NUM_CATEGORIES) {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Sufficient number of categories already exist, skipping seeding for categories.')}`);
      categories = await Category.find().select('_id');
    } else {
      for (let i = 0; i < NUM_CATEGORIES; i++) {
        const category = new Category({
          name: faker.commerce.department(),
          description: faker.lorem.sentence(),
          isActive: true
        });
        await category.save();
        categories.push(category);
      }
      console.log(`${chalk.green('✓')} ${chalk.green('Categories seeded.')}`);
    }

    const brandsCount = await Brand.countDocuments();
    if (brandsCount >= NUM_BRANDS) {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Sufficient number of brands already exist, skipping seeding for brands.')}`);
    } else {
      for (let i = 0; i < NUM_BRANDS; i++) {
        const brand = new Brand({
          name: faker.company.name(),
          description: faker.lorem.sentence(),
          isActive: true
        });
        await brand.save();
      }
      console.log(`${chalk.green('✓')} ${chalk.green('Brands seeded.')}`);
    }

    const productsCount = await Product.countDocuments();
    if (productsCount >= NUM_PRODUCTS) {
      console.log(`${chalk.yellow('!')} ${chalk.yellow('Sufficient number of products already exist, skipping seeding for products.')}`);
    } else {
      const brands = await Brand.find().select('_id');
      for (let i = 0; i < NUM_PRODUCTS; i++) {
        const randomCategoryIndex = faker.number.int(categories.length - 1);
        let imageUrl;
        if (USE_FAKER_IMAGE) {
          imageUrl = faker.image.url();
        } else {
          let imageNumber;
          if (usedImageNumbers.size < NUM_PREDEFINED_IMAGES) {
            do {
              imageNumber = faker.number.int({ min: 1, max: NUM_PREDEFINED_IMAGES });
            } while (usedImageNumbers.has(imageNumber));
            usedImageNumbers.add(imageNumber);
          } else {
            imageNumber = faker.number.int({ min: 1, max: NUM_PREDEFINED_IMAGES });
          }
          imageUrl = `/images/products/p-${imageNumber}.jpg`;
        }
        const product = new Product({
          sku: faker.string.alphanumeric(10),
          name: faker.commerce.productName(),
          description: faker.lorem.sentence(),
          quantity: faker.number.int({ min: 1, max: 100 }),
          price: faker.commerce.price(),
          taxable: faker.datatype.boolean(),
          isActive: true,
          brand: brands[faker.number.int(brands.length - 1)]._id,
          category: categories[randomCategoryIndex]._id,
          imageUrl
        });
        await product.save();
        await Category.updateOne({ _id: categories[randomCategoryIndex]._id }, { $push: { products: product._id } });
      }
      console.log(`${chalk.green('✓')} ${chalk.green('Products seeded and associated with categories.')}`);
    }
  } catch (error) {
    console.log(`${chalk.red('x')} ${chalk.red('Error while seeding database')}`);
    console.log(error);
    return null;
  } finally {
    await mongoose.connection.close();
    console.log(`${chalk.blue('✓')} ${chalk.blue('Database connection closed!')}`);
  }
};

(async () => {
  try {
    await setupDB();
    await seedDB();
  } catch (error) {
    console.error(`Error initializing database: ${error.message}`);
  }
})();
