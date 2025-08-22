// 数独生成のテスト
const { generatePuzzle } = require('./src/lib/sudoku/generator');

console.log('Testing sudoku generation...');

try {
  const puzzle = generatePuzzle({ difficulty: 'easy' });
  console.log('Generated easy puzzle:');
  console.log(puzzle);
  
  // カウント
  let filled = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (puzzle[row][col] !== 0) filled++;
    }
  }
  console.log(`Filled cells: ${filled}`);
  
} catch (error) {
  console.error('Error:', error);
}