import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

import { generateRecommendations } from '../src/controllers/configure.controllers.js';

const scenarios = [
  { name: '1. ₹40,000 Gaming', body: { budget: 40000, budgetFlex: 5000, useCases: ['Gaming'], workloads: { gaming: { resolution: '1080p' } } } },
  { name: '2. ₹50,000 Gaming', body: { budget: 50000, budgetFlex: 5000, useCases: ['Gaming'], workloads: { gaming: { resolution: '1080p' } } } },
  { name: '3. ₹60,000 Gaming', body: { budget: 60000, budgetFlex: 10000, useCases: ['Gaming'], workloads: { gaming: { resolution: '1080p' } } } },
  { name: '4. ₹75,000 Gaming', body: { budget: 75000, budgetFlex: 10000, useCases: ['Gaming'], workloads: { gaming: { resolution: '1080p' } } } },
  { name: '5. ₹50,000 Programming', body: { budget: 50000, budgetFlex: 5000, useCases: ['Programming'] } },
  { name: '6. ₹60,000 Professional', body: { budget: 60000, budgetFlex: 10000, useCases: ['Professional'] } },
  { name: '7. ₹75,000 Video Editing', body: { budget: 75000, budgetFlex: 10000, useCases: ['Video Editing'], workloads: { editing: { resolution: '4K' } } } },
  { name: '8. ₹1,50,000 Premium Gaming', body: { budget: 150000, budgetFlex: 20000, useCases: ['Gaming'], workloads: { gaming: { resolution: '1440p' } } } },
  { name: '9. ₹3,50,000 Enthusiast AI / 3D', body: { budget: 350000, budgetFlex: 50000, useCases: ['3D / Rendering', 'AI / ML'] } }
];

async function runTests() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  for (const s of scenarios) {
    console.log(`\n======================================================`);
    console.log(`TESTING: ${s.name}`);
    console.log(`======================================================`);
    
    await new Promise((resolve) => {
      let statusCode = 200;
      const req = { body: s.body };
      const res = {
        status(code) { statusCode = code; return this; },
        json(data) {
          if (data && data.data) {
            const recs = data.data.recommendations || [];
            console.log(`Recommendations returned: ${recs.length}`);
            recs.forEach((r, idx) => {
              console.log(`\n  Tier: ${r.tier} | Total: ₹${r.totalPrice?.toLocaleString('en-IN')} (Budget: ₹${s.body.budget.toLocaleString('en-IN')})`);
              console.log(`    CPU : ${r.components?.cpu?.title} (₹${r.components?.cpu?.price})`);
              console.log(`    GPU : ${r.components?.gpu?.title} (₹${r.components?.gpu?.price})`);
              console.log(`    MB  : ${r.components?.motherboard?.title} (₹${r.components?.motherboard?.price})`);
              console.log(`    RAM : ${r.components?.ram?.title} (₹${r.components?.ram?.price})`);
              console.log(`    SSD : ${r.components?.storage?.title} (₹${r.components?.storage?.price})`);
              console.log(`    PSU : ${r.components?.psu?.title} (₹${r.components?.psu?.price})`);
              console.log(`    CASE: ${r.components?.case?.title} (₹${r.components?.case?.price})`);
              console.log(`    COOL: ${r.components?.cooling?.title} (₹${r.components?.cooling?.price})`);
            });
          } else {
            console.log('Returned data:', statusCode, data);
          }
          resolve();
        }
      };

      generateRecommendations(req, res, (err) => {
        console.error(`  [NEXT ERROR] in ${s.name}:`, err.message || err);
        resolve();
      });
    });
  }

  await mongoose.disconnect();
}

runTests();
