// Test the weighted random algorithm
const prizes = [
  { id: 1, name: "Build Session", weight: 0.5 },
  { id: 2, name: "API Tokens", weight: 5.0 },
  { id: 3, name: "GPU Access", weight: 1.0 },
  { id: 4, name: "5000 Tokens", weight: 4.0 },
  { id: 5, name: "10000 Tokens", weight: 0.3 },
  { id: 6, name: "1000 Tokens", weight: 2.0 }
];

const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
console.log('Total Weight:', totalWeight);
console.log('');

// Simulate 1000 spins
const results = {};
prizes.forEach(p => results[p.id] = 0);

for (let i = 0; i < 1000; i++) {
  let random = Math.random() * totalWeight;
  let selectedPrize = prizes[0];

  for (const prize of prizes) {
    random -= prize.weight;
    if (random <= 0) {
      selectedPrize = prize;
      break;
    }
  }
  
  results[selectedPrize.id]++;
}

console.log('Results after 1000 spins:');
console.log('ID | Name              | Expected | Actual | Difference');
console.log('---|-------------------|----------|--------|------------');

prizes.forEach(p => {
  const expected = ((p.weight / totalWeight) * 100).toFixed(1);
  const actual = ((results[p.id] / 1000) * 100).toFixed(1);
  const diff = (actual - expected).toFixed(1);
  console.log(
    `${p.id}  | ${p.name.padEnd(17)} | ${expected.padStart(6)}% | ${actual.padStart(5)}% | ${diff.padStart(6)}%`
  );
});
