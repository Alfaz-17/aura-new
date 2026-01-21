// Run this with: node scripts/test-db.js
import mongoose from 'mongoose';
import { Item } from '../models/Item.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aura-flowers:aura-flowers@cluster0.7scpyth.mongodb.net/?appName=Cluster0';

async function testDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\nFetching all items...');
    const items = await Item.find({}).limit(5);
    console.log(`Found ${items.length} items`);

    if (items.length > 0) {
      console.log('\nFirst item:');
      console.log('ID:', items[0]._id.toString());
      console.log('Title:', items[0].title);
      console.log('Category:', items[0].category);
      console.log('Has slug:', !!items[0].slug);
      console.log('Full item:', JSON.stringify(items[0], null, 2));
    } else {
      console.log('⚠️  No items found in database!');
    }

    await mongoose.disconnect();
    console.log('\n✅ Test complete');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testDatabase();
