import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

import { generateRecommendations } from '../src/controllers/configure.controllers.js';

const laptopScenarios = [
  { name: '1. Laptop ₹75,000 Gaming', body: { systemType: 'laptop', budget: 75000, budgetFlex: 10000, useCases: ['Gaming'], workloads: { gaming: { resolution: '1080p' } } } },
  { name: '2. Laptop ₹1,50,000 Video Editing', body: { systemType: 'laptop', budget: 150000, budgetFlex: 15000, useCases: ['Video Editing'], workloads: { editing: { resolution: '4K' } } } },
  { name: '3. Laptop ₹2,50,000 Professional', body: { systemType: 'laptop', budget: 250000, budgetFlex: 25000, useCases: ['Professional Work'] } }
];

async function runLaptopTests() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for Laptop validation');

  for (const s of laptopScenarios) {
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
            recs.forEach((r) => {
              console.log(`\n  Tier: ${r.tier} | Total: ₹${r.totalPrice?.toLocaleString('en-IN')} (Budget: ₹${s.body.budget.toLocaleString('en-IN')})`);
              console.log(`    Model: ${r.name}`);
              console.log(`    CPU  : ${r.laptopSpecs?.cpu}`);
              console.log(`    GPU  : ${r.laptopSpecs?.gpu}`);
              console.log(`    RAM  : ${r.laptopSpecs?.ram}`);
              console.log(`    SSD  : ${r.laptopSpecs?.storage}`);
              console.log(`    Disp : ${r.laptopSpecs?.display}`);
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

runLaptopTests();
