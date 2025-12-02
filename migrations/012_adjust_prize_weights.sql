-- Change weight column to support decimal values
ALTER TABLE prizes ALTER COLUMN weight TYPE DECIMAL(5,2);

-- Adjust weights to make certain prizes harder to win
-- Lower weight = harder to win (less likely)
-- ID 5 (10000 Tokens): Hardest to win - weight 0.3
-- ID 1 (Build Session): Harder to win - weight 0.5  
-- ID 3 (GPU Access): Harder to win - weight 1.0
-- ID 6 (1000 Tokens): Medium - weight 2.0
-- ID 4 (5000 Tokens): Easier - weight 4.0
-- ID 2 (1000 API Tokens): Easiest - weight 5.0

UPDATE prizes 
SET weight = CASE id
  WHEN 1 THEN 0.5   -- Build Session (4 Hour) - harder
  WHEN 2 THEN 5.0   -- 1000 API Tokens - easiest
  WHEN 3 THEN 1.0   -- GPU Access (1 Month Enterprise) - harder
  WHEN 4 THEN 4.0   -- 5000 Tokens - easier
  WHEN 5 THEN 0.3   -- 10000 Tokens - hardest
  WHEN 6 THEN 2.0   -- 1000 Tokens - medium
  ELSE weight
END
WHERE calendar_id = 'TSI';
