# Prize Wheel Probabilities

## Updated Weights (after migration 012)

The prize wheel uses a weighted random system where **higher weight = more likely to win**.

### Prize Distribution

| Prize ID | Prize Name | Description | Weight | Probability |
|----------|-----------|-------------|--------|-------------|
| 5 | 10000 Tokens | 10000 Tokens on Pixio | **0.3** | **~2.3%** (Hardest) |
| 1 | Build Session | 4 Hour Build Session | **0.5** | **~3.9%** (Harder) |
| 3 | GPU Access | 1 Month Pixio API Enterprise | **1.0** | **~7.8%** (Harder) |
| 6 | 1000 Tokens | 1000 Tokens on Pixio | **2.0** | **~15.6%** (Medium) |
| 4 | 5000 Tokens | 5000 Tokens on Pixio | **4.0** | **~31.3%** (Easier) |
| 2 | 1000 API Tokens | 1000 Tokens on Pixio | **5.0** | **~39.1%** (Easiest) |

**Total Weight: 12.8**

## Probability Calculation

Probability for each prize = `(Prize Weight / Total Weight) × 100%`

Examples:
- Prize 5 (10000 Tokens): (0.3 / 12.8) × 100% = **2.34%**
- Prize 1 (Build Session): (0.5 / 12.8) × 100% = **3.91%**
- Prize 3 (GPU Access): (1.0 / 12.8) × 100% = **7.81%**
- Prize 2 (1000 API Tokens): (5.0 / 12.8) × 100% = **39.06%**

## Changes Made

**Before:**
- All prizes had integer weights (1-5)
- Build Session (ID 1): weight 1
- GPU Access (ID 3): weight 3
- 10000 Tokens (ID 5): weight 1

**After:**
- Weights now support decimals (DECIMAL 5,2)
- Build Session (ID 1): weight **0.5** (harder)
- GPU Access (ID 3): weight **1.0** (harder)
- 10000 Tokens (ID 5): weight **0.3** (hardest)

## Rarity Tiers

1. **Ultra Rare** (~2-4% chance): 10000 Tokens, Build Session
2. **Rare** (~8% chance): GPU Access
3. **Uncommon** (~16% chance): 1000 Tokens (ID 6)
4. **Common** (~31-39% chance): 5000 Tokens, 1000 API Tokens
